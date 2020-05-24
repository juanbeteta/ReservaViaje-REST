exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('login', function (t) {
            t.increments('id').unsigned().primary();
            t.string('usuario', 100);
            t.string('password', 100);
            t.timestamps(true, true);
    })
]);
};

exports.down = function (knex) {
return Promise.all([
    knex.schema.dropTable('login')
]);
};
