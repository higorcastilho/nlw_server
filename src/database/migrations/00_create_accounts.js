"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('accounts', table => {
        table.increments('id').primary();
        table.string('firstName').notNullable();
        table.string('lastName').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('password_reset_token');
        table.date('password_reset_expires');
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('accounts');
}
exports.down = down;
