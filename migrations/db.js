exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('login', function (t) {
            t.increments('id').unsigned().primary();
            t.string('usuario', 100);
            t.string('password', 100);
            t.boolean('descuento');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('reserva_avion', function (t) {
            t.increments('id').unsigned().primary();
            t.string('nombre_avion',100);
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
            t.string('nombre', 100);
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
            t.string('nombre_hotel',100);
            t.string('fecha_checkin', 100);
            t.string('fecha_checkout', 100);
            t.string('tipo_habitacion', 100);
            t.boolean('cama_supletoria');
            t.integer('precio');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('hotel', function (t) {
            t.increments('id').unsigned().primary();
            t.string('nombre', 100);
            t.string('fecha_checkin', 100);
            t.string('fecha_checkout', 100);
            t.string('tipo_habitacion', 100);
            t.boolean('cama_supletoria');
            t.integer('precio');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('reserva_coche', function (t) {
            t.increments('id').unsigned().primary();
            t.string('nombre_coche',100);
            t.string('fecha_recogida', 100);
            t.string('fecha_devolucion', 100);
            t.string('lugar_recogida', 100);
            t.string('lugar_devolucion', 100);
            t.boolean('tanque_lleno');
            t.integer('precio');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('coche', function (t) {
            t.increments('id').unsigned().primary();
            t.string('nombre', 100);
            t.string('fecha_recogida', 100);
            t.string('fecha_devolucion', 100);
            t.string('lugar_recogida', 100);
            t.string('lugar_devolucion', 100);
            t.boolean('tanque_lleno');
            t.integer('precio');
            t.timestamps(true, true);
        }),
        knex.schema.createTable('reserva_viaje', function (t) {
            t.increments('id').unsigned().primary(); //vuelo_id, hotel_id, coche_id, precio
            t.string('usuario', 100);
            t.integer('vuelo_id');
            t.integer('hotel_id');
            t.integer('coche_id');
            t.integer('precio');
            t.timestamps(true, true);
        }),
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('login'),
        knex.schema.dropTable('reserva_avion'),
        knex.schema.dropTable('reserva_coche'),
        knex.schema.dropTable('avion'),
        knex.schema.dropTable('hotel'),
        knex.schema.dropTable('coche'),
        knex.schema.dropTable('reserva_hotel'),
        knex.schema.dropTable('reserva_viaje')
    ]);
};
