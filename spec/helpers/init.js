process.env.NODE_ENV = 'test'
console.log('in test env');
connectionString = 'postgres://localhost:5432/jujuTestDB';

var pgp = require('pg-promise')(/*options*/)
var db = pgp(connectionString);


