const usuarioModel = require('../models/usuario');
const accesoModel = require('../models/acceso');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

  async getAll(req, res, next) {
    try {
      const data = await usuarioModel.getAll();
      return res.status(200).json(data);
    }
    catch (error) {
      return res.status(501).json({
        success: false,
        message: 'Error al obtener los usuarios'
      });
    }
  },

  async findById(req, res, next) {
    try {
      const idusuario = req.params.idusuario;
      const data = await usuarioModel.findUserById(idusuario)
      return res.status(200).json(data);
    }
    catch (error) {
      return res.status(501).json({
        success: false,
        message: 'Error al obtener el usuario por ID'
      });
    }
  },

  async getAdminsNotificationTokens(req, res, next) {
    try {
      const data = await usuarioModel.getAdminsNotificationTokens();
      let tokens = [];
      data.forEach(d => {
        tokens.push(d.notification_token);
      });
      return res.status(200).json(tokens);
    }
    catch (error) {
      return res.status(501).json({
        success: false,
        message: 'Error al obtener los repartidores'
      });
    }
  },

  async register(req, res, next) {
    try {
      const usuario = JSON.parse(req.body.usuario);
      const files = req.files;

      if (files.length > 0) {
        const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
        const url = await storage(files[0], pathImage);

        if (url != undefined && url != null) {
          usuario.image = url;
        }
      }

      const data = await usuarioModel.create(usuario);
      await accesoModel.create(data.idusuario, 1); // ROL POR DEFECTO (CLIENTE)
      return res.status(200).json({
        success: true,
        message: 'Registro Relizado Correctamente. Ya Puede Iniciar Session!',
        data: data.idusuario
      });
    }
    catch (error) {
      if (error.code === '23505') {
        return res.status(500).json({
          message: `Registro Duplicado!`,
          success: false,
        });
      } else {
        return res.status(500).json({
          message: `Error al Procesar el Registro`,
          success: false,
          error: error
        });
      }
    }
  },

  async update(req, res, next) {
    try {
      const usuario = JSON.parse(req.body.usuario);
      const files = req.files;

      if (files.length > 0) {
        const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
        const url = await storage(files[0], pathImage);

        if (url != undefined && url != null) {
          usuario.image = url;
        }
      }
      await usuarioModel.update(usuario);
      return res.status(200).json({
        success: true,
        message: 'Datos Actualizados Correctamente!'
      });
    }
    catch (error) {
      if (error.code === '23505') {
        return res.status(500).json({
          message: `Registro Duplicado!`,
          success: false,
        });
      } else {
        return res.status(500).json({
          message: `Error al Procesar el Registro`,
          success: false,
          error: error
        });
      }
    }
  },

  async updateNotificationToken(req, res, next) {
    try {
      const body = req.body;
      await usuarioModel.updateNotificationToken(body.id, body.notification_token);
      return res.status(200).json({
        success: true,
        message: 'El token de notificaciones se ha almacenado correctamente'
      });
    }
    catch (error) {
      return res.status(501).json({
        success: false,
        message: 'Hubo un error con la actualizacion de datos del usuario',
        error: error
      });
    }
  },

  async login(req, res, next) {
    try {
      const email = req.body.email;
      const clave = req.body.clave;
      const usuarioAuth = await usuarioModel.findByEmailLogin(email);

      if (!usuarioAuth) {
        return res.status(401).json({
          success: false,
          message: 'Email no Registrado'
        });
      }

      if (usuarioModel.isPasswordMatched(clave, usuarioAuth.clave)) {
        const token = jwt.sign({ idusuario: usuarioAuth.idusuario, email: usuarioAuth.email }, keys.secretOrKey, {
          // expiresIn: (60*60*24) // 1 HORA
          // expiresIn: (60 * 3) // 2 MINUTO
        });
        const data = {
          idusuario: usuarioAuth.idusuario,
          nombre: usuarioAuth.nombre,
          apellido: usuarioAuth.apellido,
          cedulaid: usuarioAuth.cedulaid,
          email: usuarioAuth.email,
          telefono: usuarioAuth.telefono,
          image: usuarioAuth.image,
          session_token: `JWT ${token}`,
          accesos: usuarioAuth.accesos
        }

        await usuarioModel.updateToken(usuarioAuth.idusuario, `JWT ${token}`);
        return res.status(201).json({
          success: true,
          data: data,
          message: usuarioAuth.nombre + ' ha sido autenticado Correctamente!'
        });
      }
      else {
        return res.status(401).json({
          success: false,
          message: 'Contraseña Invalida!'
        });
      }
    }
    catch (error) {
      return res.status(501).json({
        success: false,
        message: 'Error al momento de hacer login',
        error: error
      });
    }
  },

  async logout(req, res, next) {
    try {
      const idusuario = req.body.idusuario;
      await usuarioModel.updateToken(idusuario, null);
      return res.status(200).json({
        success: true,
        message: 'La sesion del usuario se ha cerrado correctamente'
      });
    }
    catch (e) {
      return res.status(501).json({
        success: false,
        message: 'Error al momento de cerrar sesion',
        error: error
      });
    }
  }
}