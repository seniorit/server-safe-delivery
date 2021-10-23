const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/usuario');
const Keys = require('./keys');

module.exports = function(passport) {

    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = Keys.secretOrKey;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.idusuario, (err, user) => {
          if (err) {
              return done(err, false);
          } 
          if (user) {
              return done(null, user);
          }
          else {
              return done(null, false);
          } 
        })
    }))

}
