//Cargamos el módulo express
var express = require('express');
var app = express();
var cors = require('cors')
var bp = require('body-parser');
const pdf = require('html-pdf');
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

async function reservarViaje(usuario, vuelo_id, hotel_id, coche_id, precio) {
    return await knex('reserva_viaje')
        .insert({
            usuario: usuario,
            vuelo_id: vuelo_id,
            hotel_id: hotel_id,
            coche_id: coche_id,
            precio: precio
        })
}

async function getViaje(id) {
    return await knex.raw(` select * 
                            from reserva_viaje
                            where id=` + id);
}

async function getReservas(vuelo_id, coche_id, hotel_id) {
    return await knex.raw(` select a.*, a.precio as precio_avion, c.*, c.precio as precio_coche, h.*, h.precio as precio_hotel
                            from reserva_hotel h, reserva_coche c, reserva_avion a 
                            where a.id=` + vuelo_id + ` and 
                                  c.id=` + coche_id + ` and 
                                  h.id=` + hotel_id

    );
}

app.route('/factura')
    .get(async (pet, resp) => {
        //console.log(pet.headers.id)
        const res = await getViaje(pet.headers['id'])
        //console.log(res)

        if (res.length == 0)
            resp.status(500).json({ allOk: false })

        var viajes = res[0]
        const reservas = await getReservas(viajes.vuelo_id, viajes.coche_id, viajes.hotel_id)
        //console.log(reservas)

        var salida = reservas[0];
        const content = `
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>PDF Result Template</title>
            <style>
                h1 {
                    color: green;
                }
            </style>
        </head>
        <body>
            <h1>Factura de la reserva</h1>
            <b>Reserva Hotel</b>
            <ul>
                <li>Fecha checkin: ` + salida.fecha_checkin + `</li>
                <li>Fecha checkout: ` + salida.fecha_checkout + `</li>
                <li>Tipo habitacion: ` + salida.tipo_habitacion + `</li>
                <li>Cama supletoria: ` + salida.cama_supletoria + `</li>
                <li>Precio: ` + salida.precio_hotel + `€</li>
            </ul>
            <b>Reserva Avion</b>
            <ul>
                <li>Fecha recogida: ` + salida.fecha_recogida + `</li>
                <li>Fecha devolucion: ` + salida.fecha_devolucion + `</li>
                <li>Lugar recogida: ` + salida.lugar_recogida + `</li>
                <li>Lugar devolucion: ` + salida.lugar_devolucion + `</li>
                <li>Tanque lleno: ` + salida.tanque_lleno + `</li>
                <li>Precio: ` + salida.precio_avion + `</li>
            </ul>
            <b>Reserva Coche</b>
            <ul>
                <li>Fecha ida: ` + salida.fecha_ida + ` </li>
                <li>Fecja regreso: ` + salida.fecha_regreso + `</li>
                <li>Cantidad personas: ` + salida.cantidad_personas + ` </li>
               
                <li>Lugar de Destino: ` + salida.lugar_destino + ` </li>
                <li>Precio: ` + salida.precio_coche + ` </li>
            </ul>
            <br>
            <h2>PRECIO FINAL: ` + (salida.precio_avion + salida.precio_coche + salida.precio_hotel) + `</h2>
        </body>
        </html>
        `;
        pdf.create(content).toFile('./html-pdf.pdf', function (err, res) {
            if (err) {
                resp.status(500).json({ mensaje_error: err, allOk: false })
            } else {
                resp.status(200).json({ allOk: true })
            }
        });
    })


app.route('/error')
    .get((pet, resp) => {
        code = pet.headers['codigo']
        switch (code) {
            case '400':
                resp.send("Petición incorrecta")
                break
            case '401':
                resp.send("Usuario no autorizado")
                break
            case '404':
                resp.send("Recurso no encontrado")
                break
            case '500':
                resp.send("Error interno del servidor, intente de nuevo")
                break
            default:
                resp.send("Error desconocido")
        }
    })

app.route('/reservaViaje')
    .post(async (pet, resp) => {
        console.log(pet.body)
        try {
            const codigo = await reservarViaje(pet.body.usuario, pet.body.vuelo_id, pet.body.hotel_id, pet.body.coche_id, pet.body.precio)

            resp.status(200).json({ viaje_id: codigo[0], precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ codigo: 500, mensaje_error: error, allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/usuario/verificar')
    .post(async (pet, resp) => {
        //console.log(pet.body)
        try {
            const verificar = await verificarUsuario(pet.body.usuario, pet.body.password)

            if (verificar.length > 0)
                resp.status(200).json({ allOk: true, descuento: verificar[0].descuento })
            else
                resp.status(200).json({ allOk: false })
        }
        catch (error) {
            resp.status(500).json({ mensaje_error: error, allOk: false })
            console.log("ERROR: " + error)
        }
    });


app.route('/avion/descuento')
    .get((pet, resp) => {

        var precio = pet.headers['precio']
        var descuento = precio - (precio * 25 / 100)

        resp.status(200).json({ descuento: descuento })
    });
app.route('/hotel/descuento')
    .get((pet, resp) => {

        var precio = pet.headers['precio']
        var descuento = precio - (precio * 25 / 100)

        resp.status(200).json({ descuento: descuento })
    });

app.route('/coche/descuento')
    .get((pet, resp) => {
        var precio = pet.headers['precio']
        var descuento = precio - (precio * 25 / 100)

        resp.status(200).json({ descuento: descuento })
    });
app.route('/avion/reservaAvion')
    .post(async (pet, resp) => {
        //console.log(pet.body)
        try {
            const codigo = await reservarAvion(pet.body.reserva_id,
                pet.body.fecha_ida, pet.body.fecha_regreso, pet.body.cantidad_personas,
                pet.body.lugar_ogigen, pet.body.lugar_destino, pet.body.precio)


            resp.status(200).json({ avion_id: codigo[0], precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ codigo: 500, mensaje_error: error, allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/avion/validar')
    .post(async (pet, resp) => {
        // console.log(pet.body)
        if (pet.body.reserva_id != null && pet.body.fecha_ida != null && pet.body.fecha_regreso != null)

            resp.status(200).json({ allOk: true })
        else
            resp.status(400).json({ codigo: 400, mensaje_error: "Error al validar los datos para la reserva del avion", allOk: false })
    })

app.route('/avion/disponibilidad')
    .post(async (pet, resp) => {
        //console.log(pet.body)
        try {
            const res = await comprobarVuelo(pet.body.fecha_ida, pet.body.fecha_regreso, pet.body.lugar_origen, pet.body.lugar_destino)

            if (res.length > 0) {
                var precio = res[0].precio //obtengo el primero
                resp.status(200).json({ precio: precio, allOk: true })

            } else
                resp.status(400).json({ codigo: 400, precio: -1, allOk: false })

        }
        catch (error) {
            resp.status(500).json({ mensaje_error: error, allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/hotel/reservaHotel')
    .post(async (pet, resp) => {
        try {
            const codigo = await reservarHotel(pet.body.reserva_id, pet.body.fecha_checkin, pet.body.fecha_checkout,
                pet.body.tipo_habitacion, pet.body.cama_supletoria, pet.body.precio)

            resp.status(200).json({ hotel_id: codigo[0], precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ codigo: 500, mensaje_error: error, allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/hotel/validar')
    .post(async (pet, resp) => {
        if (pet.body.fecha_checkin != null && pet.body.fecha_checkout != null)

            resp.status(200).json({ allOk: true })
        else
            resp.status(400).json({ codigo: 400, allOk: false })
    })

app.route('/hotel/disponibilidad')
    .post(async (pet, resp) => {
        try {
            //console.log(pet.body)
            const res = await comprobarHotel(pet.body.fecha_checkin, pet.body.fecha_checkout,
                pet.body.tipo_habitacion, pet.body.cama_supletoria)

            if (res.length > 0) {
                var precio = res[0].precio //obtengo el primero
                resp.status(200).json({ precio: precio, allOk: true })

            } else
                resp.status(400).json({ codigo: 400, precio: -1, allOk: false })

        }
        catch (error) {
            resp.status(500).json({ mensaje_error: error, allOk: false })
            console.log("ERROR: " + error)
        }
    })


app.route('/coche/reservaCoche')
    .post(async (pet, resp) => {
        try {
            const codigo = await reservarCoche(pet.body.reserva_id, pet.body.fecha_recogida, pet.body.fecha_devolucion, pet.body.lugar_recogida, pet.body.lugar_devolucion, pet.body.tanque_lleno, pet.body.precio)

            resp.status(200).json({ coche_id: codigo[0], precio: pet.body.precio, allOk: true })
        }
        catch (error) {
            resp.status(500).json({ codigo: 500, mensaje_error: error, allOk: false })
            console.log("ERROR: " + error)
        }
    })

app.route('/coche/validar')
    .post(async (pet, resp) => {
        //console.log(pet.body)
        if (pet.body.fecha_recogida != null, pet.body.fecha_devolucion != null,
            pet.body.lugar_recogida != null, pet.body.lugar_devolucion != null)

            resp.status(200).json({ allOk: true })
        else
            resp.status(400).json({ codigo: 400, allOk: false })
    })

app.route('/coche/disponibilidad')
    .post(async (pet, resp) => {

        try {
            const res = await comprobarCoche(pet.body.fecha_recogida,
                pet.body.fecha_devolucion, pet.body.lugar_recogida, pet.body.lugar_devolucion,
                pet.body.tanque_lleno)

            if (res.length > 0) {
                var precio = res[0].precio //obtengo el primero
                resp.status(200).json({ precio: precio, allOk: true })

            } else
                resp.status(400).json({ codigo: 400, precio: -1, allOk: false })

        }
        catch (error) {
            resp.status(500).json({ mensaje_error: error, allOk: false })
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
