exports.up = function (knex, Promise) {
  const query = knex.schema.createTableIfNotExists('images', table => {
    table.increments('id').primary()
    table.string('image').notNullable().unique()
    table.string('time_taken').notNullable()
  })

  return query
}

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTableIfExists('images')

  return query
}
