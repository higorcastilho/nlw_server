"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('classes', table => {
        table.increments('id_class_primary').primary();
        table.string('subject').notNullable();
        table.decimal('cost').notNullable();
        table.integer('account_id')
            .notNullable()
            .references('id')
            .inTable('accounts')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('classes');
}
exports.down = down;
