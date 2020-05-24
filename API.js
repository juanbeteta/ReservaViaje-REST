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

async function comprobarVuelo(fecha_ida, fecha_regreso, lugar_origen, lugar_destino) {
    return await knex.raw(` select precio
                            from vuelo_avion 
                            where fecha_ida="` + fecha_ida + `" and 
                                  fecha_regreso="` + fecha_regreso + `" and 
                                  lugar_origen="` + lugar_origen + `" and 
                                  lugar_destino="` + lugar_destino +`"`
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

app.route('/usuario/verificar')
    .get(async (pet, resp) => {

        try {
            const verificar = await verificarUsuario(pet.body.usuario, pet.body.password)

            if (verificar.length > 0)
                resp.status(200).send('Verificación correcta');
            else
                resp.status(400).send('Verificación incorrecta');
        }
        catch (error) {
            resp.status(500).send('Error en el servidor')
        }
    });

app.route('/reservaAvion')
    .post(async (pet, resp) => {
        try {
            await reservarAvion(pet.body.reserva_id, pet.body.fecha_ida, pet.body.fecha_regreso, pet.body.cantidad_personas, pet.body.lugar_ogigen, pet.body.lugar_destino, pet.body.precio)

            resp.status(200).json({precio: pet.body.precio, allOk: true})
        }
        catch (error) {
            resp.status(500).send('Error en el servidor')
        }
    })

app.route('/validar')
    .get(async (pet, resp) => {
        if (pet.body.reserva_id != "" && pet.body.fecha_ida != "" && pet.body.fecha_regreso != "" && pet.body.cantidad_personas > 0 && pet.body.lugar_ogigen != "" && pet.body.lugar_destino != "" && pet.body.precio > 0)
            resp.status(200).send('Verificación correcta');
        else
            resp.status(400).send('Verificación incorrecta');
    })

app.route('/disponibilidad')
    .get(async (pet, resp) => {
        try {
            const res = await comprobarVuelo(pet.body.fecha_ida, pet.body.fecha_regreso, pet.body.lugar_origen, pet.body.lugar_destino)
            
            var precio = res[0].precio //obtengo el primero
            if(precio > 0)
                resp.status(200).json({precio: precio, allOk: true})
             else
                resp.status(200).json({precio: -1, allOk: false})
            
        }
        catch (error) {
            resp.status(500).send('Error en el servidor')
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