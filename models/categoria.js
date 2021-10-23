const db = require('../config/db');

const Categoria = {};

Categoria.getAll = () => {

  const sql = `
  SELECT idcategoria, categoria,descripcion
  FROM tbcategoria ORDER BY categoria`;
  return db.manyOrNone(sql);
}

Categoria.create = (data) => {
  const sql = `
    INSERT INTO tbcategoria(categoria,descripcion,createdat,updatedat)
    VALUES ($1, $2, $3, $4) RETURNING idcategoria`;
  return db.oneOrNone(sql, [
    data.categoria,
    data.descripcion,
    new Date(),
    new Date()
  ]);
}

Categoria.update = (data) => {
  const sql = `
  UPDATE tbcategoria SET categoria=$2, descripcion=$3, updatedat=$4 WHERE idcategoria=$1`;
  return db.none(sql, [data.idcategoria, data.categoria, data.descripcion, new Date()]);
}

Categoria.delete =(idcategoria)=>{
  const sql=`DELETE FROM tbcategoria WHERE idcategoria=$1`;
  return db.none(sql, idcategoria);
}

module.exports = Categoria;