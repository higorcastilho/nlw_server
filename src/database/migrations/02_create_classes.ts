import Knex from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('classes', table => {
		table.increments('id_class_primary').primary()
		table.string('subject').notNullable()
		table.decimal('cost').notNullable()

		table.integer('account_id')
			.notNullable()
			.references('id')
			.inTable('accounts')
			.onUpdate('CASCADE')
			.onDelete('CASCADE')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('classes')
}