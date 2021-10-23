const Categoria = require('../controllers/categoria');
const passport = require('passport');

module.exports = (app)=>{
  app.get('/api/categoria/getAll',passport.authenticate('jwt', {session: false}), Categoria.getAll);
  app.post('/api/categoria/create',passport.authenticate('jwt', {session: false}), Categoria.create);
  app.put('/api/categoria/update',passport.authenticate('jwt', {session: false}), Categoria.update);
  app.delete('/api/categoria/delete/:idcategoria',passport.authenticate('jwt', {session: false}), Categoria.delete);
  
}