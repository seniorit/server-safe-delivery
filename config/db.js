const promise = require('bluebird');
const options = {
  promiseLib: promise,
  query: (e) => { }
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

const databaseConfig = {
  // 'host': '127.0.0.1',
  // 'port': 5432,
  // 'database': 'deliverydb',
  // 'user': 'postgres',
  // 'password': '132632'
};

// const databaseConfig = {
//   'host': 'ec2-18-211-243-247.compute-1.amazonaws.com',
//   'port': 5432,
//   'database': 'dabhvt11a1qgqo',
//   'user': 'pjikfmezuucsca',
//   'password': 'f37a064cdc669bea1b9fc228f227cc72ff31ae74e922b7a7011628c7d343d78f',
//   'ssl': {
//     'require': true, // This will help you. But you will see nwe error
//     'rejectUnauthorized': false // This line will fix new error
//   }
// };

const db = pgp(databaseConfig);
module.exports = db;