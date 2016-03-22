require('dotenv').config();

// handling DB connection for tests
if(process.env.NODE_ENV === 'test'){
  connectionString = process.env.TEST_DATABASE_URL;
} else if(process.env.NODE_ENV !== 'test') {
  connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/juju';
}

module.exports = connectionString;
