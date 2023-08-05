// console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);
// if (process.env.NODE_ENV === 'development') {
      require('dotenv').config({ path: '.development.env' });
// }

module.exports =
    {
      "username": process.env.POSTGRES_USER,
      "password": process.env.POSTGRES_PASSWORD,
      "database": process.env.POSTGRES_DB,
      "host": process.env.POSTGRES_HOST,
      "dialect": 'postgres',
      "protocol": process.env.POSTGRES_PROTOCOL,
      "port": +process.env.POSTGRES_PORT,

      // "dialectOptions": {
      //   "ssl": {
      //     "require": process.env.NODE_ENV === 'development',
      //     "rejectUnauthorized": false
      //   }
      // }
    }
