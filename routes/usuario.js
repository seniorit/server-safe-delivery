const Usuario = require('../controllers/usuario');
const passport = require('passport');
module.exports = (app, upload) => {


  app.get('/api/usuario/getAll', passport.authenticate('jwt', { session: false }), Usuario.getAll);
  app.get('/api/usuario/findById/:idusuario', passport.authenticate('jwt', { session: false }), Usuario.findById);
  //app.get('/api/usuario/findDeliveryMen', passport.authenticate('jwt', {session: false}), Usuario.findDeliveryMen);
  //app.get('/api/usuario/getAdminsNotificationTokens', passport.authenticate('jwt', {session: false}), Usuario.getAdminsNotificationTokens);

  app.post('/profile', );
  // GUARDAR DATOS
  app.post('/api/usuario/create', upload.array('image', 1),Usuario.register);
  app.post('/api/usuario/login', Usuario.login);
  app.post('/api/usuario/logout', Usuario.logout);

  // ACTUALIZAR DATOS
  app.put('/api/usuario/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), Usuario.update)
  app.put('/api/usuario/updateNotificationToken', Usuario.updateNotificationToken)
  

}