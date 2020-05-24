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

async function verificarUsuario(usuario, password) {
    return await knex.raw(` select * 
                            from login 
                            where usuario="` + usuario + `" and password="` + password + `"`
    );
}


app.route('/usuario/verificar')
    .get(async (pet, resp) => {
        
        try{
            const verificar = await verificarUsuario(pet.body.usuario, pet.body.password)

            if (verificar.length > 0) 
                resp.status(200).send('Verificación correcta');
            else 
                resp.status(400).send('Verificación incorrecta');
        }
        catch(error){ 
            resp.status(500).send('Error en el servidor')
        }
    });



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