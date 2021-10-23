const db = require('../config/db');

const Articulo = {};

Articulo.findByCategoria = (idcategoria) => {
  const sql = `
    SELECT
      A.idarticulo,
      A.idcategoria,
      A.cod_articulo,
      A.descripcion,
      A.precio,
      A.image1,
      A.image2,
      A.image3
    FROM
      tbarticulo AS A
    INNER JOIN
      tbcategoria AS C
    ON
      A.idcategoria = C.idcategoria
    WHERE
      C.idcategoria = $1
    `;

  return db.manyOrNone(sql, idcategoria);
}

Articulo.findByCatAndArt = (idcategoria, cod_articulo) => {
  const sql = `
    SELECT
       A.idarticulo,
       A.idcategoria,
       A.cod_articulo,
       A.descripcion,
       A.precio,
       A.image1,
       A.image2,
       A.image3
    FROM tbarticulo AS A
    INNER JOIN tbcategoria AS C ON A.idcategoria = C.idcategoria
    WHERE
        C.idcategoria = $1 AND A.cod_articulo ILIKE $2
    `;
  return db.manyOrNone(sql, [idcategoria, `%${cod_articulo}%`]);
}


Articulo.create = (data) => {
  const sql = `
    INSERT INTO
        tbarticulo(
          cod_articulo,
          descripcion,
          precio,
          image1,
          image2,
          image3,
          idcategoria,
          createdat,
          updatedat
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING idarticulo
    `;
  return db.oneOrNone(sql, [
    data.cod_articulo,
    data.descripcion,
    data.precio,
    data.image1,
    data.image2,
    data.image3,
    data.idcategoria,
    new Date(),
    new Date()
  ]);
}

Articulo.update = (data) => {
  const sql = `
    UPDATE
        tbarticulo
    SET
        cod_articulo = $2,
        descripcion = $3,
        precio = $4,
        image1 = $5,
        image2 = $6,
        image3 = $7,
        idcategoria = $8,
        updatedat = $9
    WHERE
        idarticulo = $1
    `;
  return db.none(sql, [
    data.idarticulo,
    data.cod_articulo,
    data.descripcion,
    data.precio,
    data.image1,
    data.image2,
    data.image3,
    data.idcategoria,
    new Date()
  ]);
}

Articulo.delete =(idarticulo)=>{
  const sql=`DELETE FROM tbarticulo WHERE idarticulo=$1`;
  return db.none(sql, idarticulo);
}

module.exports = Articulo;