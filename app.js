const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const ip = require('ip');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');

/*
* INICIALIZAR FIREBASE ADMIN
*/
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
  storage: multer.memoryStorage()
});


/*
* RUTAS
*/
const usuario = require('./routes/usuario');
const categoria = require('./routes/categoria');
const articulo = require('./routes/articulo');

const port = process.env.PORT || 3200;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

//global._ENVIRONMENT_ = 'development';
//global._SERVER = 'https://server-safe-delivery.herokuapp.com/';
//global._IP_SERVER = ip.address();

/*
* LLAMANDO A LA RUTAS
*/
usuario(app, upload);
categoria(app);
articulo(app, upload);

//online
server.listen(port, function () {
  console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.stack);
});

module.exports = {
  app: app,
  server: server
}

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR

