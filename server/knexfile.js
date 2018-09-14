require('dotenv').config()
module.exports = {
  client: 'postgresql',
  connection: process.env.DB_CONNECTION_STRING,
  migrations: {
    tableName: 'knex_migrations'
  }
}
