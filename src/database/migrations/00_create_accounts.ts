import Knex from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('accounts', table => {
		table.increments('id').primary()
		table.string('firstName').notNullable()
		table.string('lastName').notNullable()
		table.string('email').notNullable()
		table.string('password').notNullable()

		table.string('password_reset_token')
		table.string('password_reset_expires')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('accounts')
}