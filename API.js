//Cargamos el módulo express
var express = require('express');
var app = express();
var cors = require('cors')
var bp = require('body-parser');
app.use(cors())

app.use(bp.json())
const knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: "./dev.sqlite3",
    },
    pool: {
        afterCreate: function (conn, cb) {
            conn.run('PRAGMA foreign_keys = ON', cb)
        }
    },
    useNullAsDefault: true
});

async function comprobarCoche(fecha_recogida, fecha_devolucion, lugar_recogida, lugar_devolucion, tanque_lleno) {
    return await knex.raw(` select precio
                            from coche 
                            where fecha_recogida="` + fecha_recogida + `" and 
                                  fecha_devolucion="` + fecha_devolucion + `" and 
                                  lugar_recogida="` + lugar_recogida + `" and 
                                  lugar_devolucion="` + lugar_devolucion + `" and 
                                  tanque_lleno=` + tanque_lleno
    );
}

async function comprobarVuelo(fecha_ida, fecha_regreso, lugar_origen, lugar_destino) {
    return await knex.raw(` select precio
                            from avion 
                            where fecha_ida="` + fecha_ida + `" and 
                                  fecha_regreso="` + fecha_regreso + `" and 
                                  lugar_origen="` + lugar_origen + `" and 
                                  lugar_destino="` + lugar_destino + `"`
    );
}

// pet.body.fecha_checkin, pet.body.fecha_checkout, pet.body.tipo_habitacion, pet.body.cama_supletoria, pet.body.precio
async function comprobarHotel(fecha_checkin, fecha_checkout, tipo_habitacion, cama_supletoria) {
    return await knex.raw(` select precio
                            from hotel 
                            where fecha_checkin="` + fecha_checkin + `" and 
                                  fecha_checkout="` + fecha_checkout + `" and 
                                  tipo_habitacion="` + tipo_habitacion + `" and 
                                  cama_supletoria=` + cama_supletoria
    );
}

async function verificarUsuario(usuario, password) {
    return await knex.raw(` select * 
                            from login 
                            where usuario="` + usuario + `" and password="` + password + `"`
    );
}

async function reservarAvion(reserva_id, fecha_ida, fecha_regreso, cantidad_personas, lugar_origen, lugar_destino, precio) {
    return await knex('reserva_avion')
        .insert({
            reserva_id: reserva_id,
            fecha_ida: fecha_ida,
            fecha_regreso: fecha_regreso,
            cantidad_personas: cantidad_personas,
            lugar_origen: lugar_origen,
            lugar_destino: lugar_destino,
            precio: precio
        })
    //.returning('id')
}

async function reservarHotel(reserva_id, fecha_checkin, fecha_checkout, tipo_habitacion, cama_supletoria, precio) {
    return await knex('reserva_hotel')
        .insert({
            reserva_id: reserva_id,
            fecha_checkin: fecha_checkin,
            fecha_checkout: fecha_checkout,
            tipo_habitacion: tipo_habitacion,
            cama_supletoria: cama_supletoria,
            precio: precio
        })
}

async function reservarCoche(reserva_id, fecha_recogida, fecha_devolucion, lugar_recogida, lugar_devolucion, tanque_lleno, precio) {
    return await knex('reserva_coche')
        .insert({
            reserva_id: reserva_id,
            fecha_recogida: fecha_recogida,
            fecha_devolucion: fecha_devolucion,
            lugar_recogida: lugar_recogida,
            lugar_devolucion: lugar_devolucion,
            tanque_lleno: tanque_lleno,
            precio: precio
        })
}

async function reservarViaje(vuelo_id, hotel_id, coche_id, precio) {
    return await knex('reserva_viaje')
        .insert({
            vuelo_id: vuelo_id,
            hotel_id: hotel_id,
            coche_id: coche_id,
            precio: precio
        })
}

app.route('/reservaViaje')
    .post( async (pet, resp)=> {
        try {
            await reservarViaje(pet.body.vuelo_id, pet.body.hotel_id, pet.body.coche_id, pet.body.precio)

            resp.status(200).json({ precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/usuario/verificar')
    .get(async (pet, resp) => {
        try {
            const verificar = await verificarUsuario(pet.body.usuario, pet.body.password)

            if (verificar.length > 0)
                resp.status(200).json({ allOk: true })
            else
                resp.status(400).json({ allOk: false })
        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    });

app.route('/avion/reservaAvion')
    .post(async (pet, resp) => {
        try {
            await reservarAvion(pet.body.reserva_id, pet.body.fecha_ida, pet.body.fecha_regreso, pet.body.cantidad_personas, pet.body.lugar_ogigen, pet.body.lugar_destino, pet.body.precio)

            resp.status(200).json({ precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/avion/validar')
    .get(async (pet, resp) => {
        if (pet.body.reserva_id != null && pet.body.fecha_ida != null && pet.body.fecha_regreso != null &&
            pet.body.cantidad_personas > 0 && pet.body.lugar_ogigen != null && pet.body.lugar_destino != null && pet.body.precio > 0)

            resp.status(200).json({ allOk: true })
        else
            resp.status(400).json({ allOk: false })
    })

app.route('/avion/disponibilidad')
    .get(async (pet, resp) => {
        try {
            const res = await comprobarVuelo(pet.body.fecha_ida, pet.body.fecha_regreso, pet.body.lugar_origen, pet.body.lugar_destino)

            if (res.length > 0) {
                var precio = res[0].precio //obtengo el primero
                resp.status(200).json({ precio: precio, allOk: true })

            } else
                resp.status(200).json({ precio: -1, allOk: false })

        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/hotel/reservaHotel')
    .post(async (pet, resp) => {
        try {
            await reservarHotel(pet.body.reserva_id, pet.body.fecha_checkin, pet.body.fecha_checkout,
                pet.body.tipo_habitacion, pet.body.cama_supletoria, pet.body.precio)

            resp.status(200).json({ precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/hotel/validar')
    .get(async (pet, resp) => {
        if (pet.body.reserva_id != null && pet.body.fecha_checkin != null &&
            pet.body.fecha_checkout != null && pet.body.tipo_habitacion > 0 && pet.body.precio > 0)

            resp.status(200).json({ allOk: true })
        else
            resp.status(400).json({ allOk: false })
    })

app.route('/hotel/disponibilidad')
    .get(async (pet, resp) => {
        try {
            const res = await comprobarHotel(pet.body.fecha_checkin, pet.body.fecha_checkout,
                pet.body.tipo_habitacion, pet.body.cama_supletoria)

            if (res.length > 0) {
                var precio = res[0].precio //obtengo el primero
                resp.status(200).json({ precio: precio, allOk: true })

            } else
                resp.status(200).json({ precio: -1, allOk: false })

        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    })


app.route('/hotel/reservaCoche')
    .post(async (pet, resp) => {
        try {
            await reservarCoche(pet.body.reserva_id, pet.body.fecha_recogida, pet.body.fecha_devolucion, pet.body.lugar_recogida, pet.body.lugar_devolucion, pet.body.tanque_lleno, pet.body.precio)

            resp.status(200).json({ precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/coche/validar')
    .get(async (pet, resp) => {
        if (pet.body.fecha_recogida != null, pet.body.fecha_devolucion != null,
            pet.body.lugar_recogida != null, pet.body.lugar_devolucion != null,
            pet.body.tanque_lleno != null, pet.body.precio != null)

            resp.status(200).json({ allOk: true })
        else
            resp.status(400).json({ allOk: false })
    })

app.route('/hotel/disponibilidad')
    .get(async (pet, resp) => {
        try {
            const res = await comprobarCoche( pet.body.fecha_recogida, 
                pet.body.fecha_devolucion, pet.body.lugar_recogida, pet.body.lugar_devolucion,
                 pet.body.tanque_lleno)

            if (res.length > 0) {
                var precio = res[0].precio //obtengo el primero
                resp.status(200).json({ precio: precio, allOk: true })

            } else
                resp.status(200).json({ precio: -1, allOk: false })

        }
        catch (error) {
            resp.status(500).json({ allOk: false })
            console.log("ERROR: " + error)
        }
    })

//En Express asociamos un método HTTP y una URL con un callback a ejecutar
app.get('*', function (pet, resp) {
    //console.log(pet.body)
    //Tenemos una serie de primitivas para devolver la respuesta HTTP
    resp.status(200);
    resp.send('Hola soy Express');
});

//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
});