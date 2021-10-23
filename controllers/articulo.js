const articuloModel = require('../models/articulo');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {

  async findByCat(req, res, next) {
    try {
      const idcategoria = req.params.idcategoria; // CLIENTE
      const data = await articuloModel.findByCategoria(idcategoria);
      return res.status(200).json(data);
    }
    catch (error) {
      return res.status(501).json({
        message: `Error al listar los productos por categoria`,
        success: false,
        error: error
      });
    }
  },

  async findByCatAndCod(req, res, next) {
    try {
      const idcategoria = req.params.idcategoria; // CLIENTE
      const cod_articulo = req.params.cod_articulo; // CLIENTE
      const data = await articuloModel.findByCatAndArt(idcategoria, cod_articulo);
      return res.status(200).json(data);
    }
    catch (error) {
      return res.status(501).json({
        message: `Error al listar los productos por categoria`,
        success: false,
        error: error
      });
    }
  },

  async create(req, res, next) {
    let articulo = JSON.parse(req.body.articulo);
    const files = req.files;
    let inserts = 0;

    if (files.length === 0) {
      return res.status(501).json({
        message: 'Error al registrar el Articulo no tiene imagen',
        success: false
      });
    } else {
      try {
        const data = await articuloModel.create(articulo); // ALMACENANDO LA INFORMACION
        articulo.idarticulo = data.idarticulo;

        const start = async () => {
          await asyncForEach(files, async (file) => {
            const pathImage = `image_${Date.now()}`;
            const url = await storage(file, pathImage);

            if (url !== undefined && url !== null) {
              if (inserts == 0) { // IMAGEN 1
                articulo.image1 = url;
              }
              else if (inserts == 1) { // IMAGEN 2
                articulo.image2 = url;
              }
              else if (inserts == 2) { // IMAGEN 3
                articulo.image3 = url;
              }
            }

            await articuloModel.update(articulo);
            inserts = inserts + 1;

            if (inserts == files.length) {
              return res.status(201).json({
                success: true,
                message: 'Articulo se ha registrado correctamente'
              });
            }

          });
        }
        start();
      } catch (error) {
        return res.status(501).json({
          message: `Error al registrar el producto ${error}`,
          success: false,
          error: error
        });
      }
    }
  },

  async update(req, res, next) {
    try {
      const articulo = req.body;
      await articuloModel.update(articulo);
      return res.status(201).json({
        success: true,
        message: 'Articulo Actualizado Correctamente!'
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(500).json({
          message: `Codigo ya Registrado. No se Permiten Duplicados!`,
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

  async updateWhitImage(req, res, next) {
    let articulo = JSON.parse(req.body.articulo);
    const files = req.files;
    let inserts = 0;

    if (files.length === 0) {
      return res.status(501).json({
        message: 'Error al registrar el Articulo no tiene imagen',
        success: false
      });
    } else {
      try {
        const data = await articuloModel.update(articulo); // ALMACENANDO LA INFORMACION
        articulo.idarticulo = data.idarticulo;

        const start = async () => {
          await asyncForEach(files, async (file) => {
            const pathImage = `image_${Date.now()}`;
            const url = await storage(file, pathImage);

            if (url !== undefined && url !== null) {
              if (inserts == 0) { // IMAGEN 1
                articulo.image1 = url;
              }
              else if (inserts == 1) { // IMAGEN 2
                articulo.image2 = url;
              }
              else if (inserts == 2) { // IMAGEN 3
                articulo.image3 = url;
              }
            }

            await articuloModel.update(articulo);
            inserts = inserts + 1;
            if (inserts == files.length) {
              return res.status(201).json({
                success: true,
                message: 'Articulo Registrado Correctamente!'
              });
            }

          });
        }
        start();
      } catch (error) {
        return res.status(501).json({
          message: `Error al registrar el producto ${error}`,
          success: false,
          error: error
        });
      }
    }
  },

  async delete(req, res, next) {
    try {
      const idarticulo = req.params.idarticulo;
      await articuloModel.delete(idarticulo)
      return res.status(200).json({
        message: 'Articulo Eliminado Correctamente!',
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