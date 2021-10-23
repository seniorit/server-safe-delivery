const db = require('../config/db');

const Acceso = {};

Acceso.create = (idusuario, idacceso) => {
  const sql = `
    INSERT INTO tbusuario_has_acceso(idusuario,idacceso,createdat,updatedat)
    VALUES($1, $2, $3, $4)`;
  return db.none(sql, [
    idusuario,
    idacceso,
    new Date(),
    new Date()
  ]);
}

module.exports = Acceso;