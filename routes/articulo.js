const Articulo = require('../controllers/articulo');
const passport = require('passport');

module.exports = (app, upload) => {

  app.get('/api/articulo/findByCat/:idcategoria', passport.authenticate('jwt', { session: false }), Articulo.findByCat);
  app.get('/api/articulo/findByCatAndCod/:idcategoria/:cod_articulo', passport.authenticate('jwt', { session: false }), Articulo.findByCatAndCod);
  app.post('/api/articulo/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), Articulo.create);
  app.put('/api/articulo/update', passport.authenticate('jwt', { session: false }), upload.array('image', 3), Articulo.update);
  app.delete('/api/articulo/delete/:idarticulo', passport.authenticate('jwt', { session: false }), Articulo.delete);
  
}