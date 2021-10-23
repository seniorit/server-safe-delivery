const categoriaModel = require('../models/categoria');

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await categoriaModel.getAll();
      return res.status(200).json(data);
    }
    catch (error) {
      return res.status(501).json({
        message: 'Hubo un error al tratar de obtener las categorias',
        error: error,
        success: false
      })
    }
  },

  async create(req, res, next) {
    try {
      const categoria = req.body;
      const data = await categoriaModel.create(categoria);
      return res.status(201).json({
        message: 'Categoría Creada Correctamente!',
        success: true,
        data: data.idcategoria
      });
    }
    catch (error) {
      if (error.code === '23505') {
        return res.status(500).json({
          message: `La Categoría ya Existe!`,
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
      const categoria = req.body;
      await categoriaModel.update(categoria);
      return res.status(200).json({
        message: 'Categoría Actualizada Correctamente!',
        success: true,
      });
    }
    catch (error) {
      if (error.code === '23505') {
        return res.status(500).json({
          message: `La Categoria ya Existe, Registro Duplicado!`,
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

  async delete(req, res, next) {
    try {
      const idcategoria = req.params.idcategoria;
      await categoriaModel.delete(idcategoria)
      return res.status(200).json({
        message: 'Categoría Eliminada Correctamente!',
        success: true,
      });
    }
    catch (error) {
      return res.status(500).json({
        message: `Error al Procesar el Registro`,
        success: false,
        error: error
      });
    }
  }

}