const db = require('../config/db');
const crypto = require('crypto');

const Usuario = {};

Usuario.getAll = () => {
  const sql = `
    SELECT * FROM tbusuario`;
  return db.manyOrNone(sql);
}

Usuario.findById = (idusuario, callBack) => {
  const sql = `
  SELECT idusuario, nombre, apellido, cedulaid, email, telefono, 
  clave, is_available, session_token, notification_token, 
  image FROM tbusuario WHERE idusuario=$1`;

  return db.oneOrNone(sql, idusuario).then(usuario => { callBack(null, usuario) });
}

Usuario.findByEmailLogin = (email) => {
  const sql=`
    SELECT
    u.idusuario,
    u.nombre,
    u.apellido,
    u.cedulaid,
    u.email,
    u.telefono,
    u.image,
    u.clave,
    u.session_token,
        json_agg(
          json_build_object(
              'idacceso', A.idacceso,
              'label', A.label,
              'image', A.image,
              'route', A.route
          ) ORDER BY A.idacceso ASC
        ) AS accesos
    FROM tbusuario u
    INNER JOIN tbusuario_has_acceso ua ON ua.idusuario=u.idusuario
    INNER JOIN tbacceso a ON a.idacceso=ua.idacceso
    WHERE u.email=$1
  GROUP BY u.idusuario`;
  return db.oneOrNone(sql, email);
}

Usuario.findUserById = (idusuario) => {
  const sql = `
  SELECT U.idusuario, U.nombre, U.apellido, U.cedulaid, U.email, U.telefono, 
  U.clave, U.is_available, U.session_token, U.notification_token, 
  U.image,
    json_agg(
      json_build_object(
        'idacceso', A.idacceso,
        'label', A.label,
        'image', A.image,
        'route', A.route      
      )ORDER BY A.idacceso ASC
    ) AS accesos 
  FROM tbusuario U 
  INNER JOIN tbusuario_has_acceso UHA ON UHA.idusuario = U.idusuario
  INNER JOIN tbacceso A ON A.idacceso = UHA.idacceso 
  WHERE U.idusuario = $1 GROUP BY U.idusuario`;
  return db.oneOrNone(sql, idusuario);
}

Usuario.findByEmail = (email) => {
  const sql = `
  SELECT U.idusuario, U.nombre, U.apellido, U.cedulaid, U.email, U.telefono, 
  U.clave, U.is_available, U.session_token, U.notification_token, 
  U.image,
    json_agg(
      json_build_object(
        'idacceso', A.idacceso,
        'label', A.label,
        'image', A.image,
        'route', A.route      
      )ORDER BY A.idacceso ASC
    ) AS accesos 
  FROM tbusuario U 
  INNER JOIN tbusuario_has_acceso UHA ON UHA.idusuario = U.idusuario
  INNER JOIN tbacceso A ON A.idacceso = UHA.idacceso 
  WHERE U.email = $1 GROUP BY U.idusuario`;
  return db.oneOrNone(sql, email);
}

Usuario.getAdminsNotificationTokens = () => {
  const sql = `
  SELECT U.notification_token 
  FROM tbusuario U 
  INNER JOIN tbusuario_has_acceso UHA ON UHA.idusuario = U.idusuario
  INNER JOIN tbacceso A ON A.idacceso = UHA.idacceso
  WHERE A.idacceso = 2`;
  return db.manyOrNone(sql);
}

Usuario.getUserNotificationToken = (id) => {
  const sql = `
  SELECT U.notification_token
  FROM tbusuario U
  WHERE U.id = $1`;
  return db.oneOrNone(sql, id);
}

Usuario.create = (usuario) => {
  const myPasswordHashed = crypto.createHash('md5').update(usuario.clave).digest('hex');
  usuario.clave = myPasswordHashed;

  const sql = `
  INSERT INTO
    tbusuario(
      nombre,
      apellido,
      cedulaid,
      email,
      telefono,
      image,
      clave,
      createdat,
      updatedat
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING idusuario`;

    return db.oneOrNone(sql, [
      usuario.nombre,
      usuario.apellido,
      usuario.cedulaid,
      usuario.email,
      usuario.telefono,
      usuario.image,
      usuario.clave,
      new Date(),
      new Date()
    ]);
}

Usuario.update = (usuario) => {
  const sql = `
  UPDATE tbusuario SET
    nombre = $2,
    apellido = $3,
    cedulaid = $4,
    telefono = $5,
    image = $6,
    updatedat = $7
  WHERE idusuario = $1`;
  return db.none(sql, [
    usuario.idusuario,
    usuario.nombre,
    usuario.apellido,
    usuario.cedulaid,
    usuario.telefono,
    usuario.image,
    new Date()
  ]);
}

Usuario.updateToken = (idusuario, token) => {
  const sql = `
  UPDATE tbusuario SET session_token = $2 WHERE idusuario = $1
  `;
  return db.none(sql, [idusuario,token]);
}

Usuario.updateNotificationToken = (idusuario, token) => {
  const sql = `
  UPDATE tbusuario SET notification_token = $2 WHERE idusuario = $1
  `;
  return db.none(sql, [idusuario,token]);
}
   
Usuario.isPasswordMatched = (usuarioClave, hash) => {
  const myPasswordHashed = crypto.createHash('md5').update(usuarioClave).digest('hex');
  if (myPasswordHashed === hash) {
    return true;
  }
  return false;
}

module.exports = Usuario;