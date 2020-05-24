const vuelos = [];

const vuelo1 = () => ({
   fecha_ida: "10-10-10",
   fecha_regreso: "11-10-10",
   cantidad_personas: 100,
   lugar_origen: "alicante",
   lugar_destino: "madrid",
   precio: 50
})

const vuelo2 = () => ({
   fecha_ida: "21-10-10",
   fecha_regreso: "22-10-10",
   cantidad_personas: 100,
   lugar_origen: "alicante",
   lugar_destino: "narnia",
   precio: 100
})

const vuelo3 = () => ({
   fecha_ida: "10-10-10",
   fecha_regreso: "11-10-10",
   cantidad_personas: 100,
   lugar_origen: "alicante",
   lugar_destino: "kamehouse",
   precio: 80
})

exports.seed = async function (knex, Promise) {

   vuelos.push(vuelo1());
   vuelos.push(vuelo2());
   vuelos.push(vuelo3());
   await knex('avion').insert(vuelos)
};