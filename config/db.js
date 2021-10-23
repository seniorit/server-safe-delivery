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
  'host': 'ec2-52-71-241-37.compute-1.amazonaws.com',
  'port': 5432,
  'database': 'dfo2htn7lrjnig',
  'user': 'badmuftkhnwajc',
  'password': '5712ba98242dfaca3b18f8f26da775a9258ebee82ae04387dd9aabaea7a4a6f2',
  'ssl': {
    'require': true, // This will help you. But you will see nwe error
    'rejectUnauthorized': false // This line will fix new error
  }
};

const db = pgp(databaseConfig);
module.exports = db;