exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('login', function (t) {
            t.increments('id').unsigned().primary();
            t.string('usuario', 100);
            t.string('password', 100);
            t.timestamps(true, true);
        }),
        knex.schema.createTable('reserva_avion', function (t) {
            t.increments('id').unsigned().primary();
            t.string('reserva_id', 100);
            t.string('fecha_ida', 100);
            t.string('fecha_regreso', 100);
            t.integer('cantidad_personas');
            t.string('lugar_origen', 100);
            t.string('lugar_destino', 100);
            t.integer('precio');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('avion', function (t) {
            t.increments('id').unsigned().primary();
            t.string('fecha_ida', 100);
            t.string('fecha_regreso', 100);
            t.integer('cantidad_personas');
            t.string('lugar_origen', 100);
            t.string('lugar_destino', 100);
            t.integer('precio');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('reserva_hotel', function (t) {
            t.increments('id').unsigned().primary();
            t.string('reserva_id', 100);
            t.string('fecha_checkin', 100);
            t.string('fecha_checkout', 100);
            t.string('tipo_habitacion', 100);
            t.boolean('cama_supletoria');
            t.integer('precio');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('hotel', function (t) {
            t.increments('id').unsigned().primary();
            t.string('fecha_checkin', 100);
            t.string('fecha_checkout', 100);
            t.string('tipo_habitacion', 100);
            t.boolean('cama_supletoria');
            t.integer('precio');
            t.timestamps(true, true);
        })
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('login'),
        knex.schema.dropTable('reserva_avion'),
        knex.schema.dropTable('avion'),
        knex.schema.dropTable('hotel'),
        knex.schema.dropTable('reserva_hotel')
    ]);
};
