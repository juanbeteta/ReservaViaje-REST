const vuelos = [];

const vuelo1 = () => ({
   nombre: "american airland",
   fecha_ida: "2020-06-10",
   fecha_regreso: "2020-06-20",
   cantidad_personas: 100,
   lugar_origen: "alicante",
   lugar_destino: "madrid",
   precio: 50
})

const vuelo2 = () => ({
   nombre: "avion kamikase",
   fecha_ida: "2020-06-11",
   fecha_regreso: "2020-06-20",
   cantidad_personas: 100,
   lugar_origen: "alicante",
   lugar_destino: "narnia",
   precio: 100
})

const vuelo3 = () => ({
   nombre: "allahu akbar",
   fecha_ida: "2020-06-12",
   fecha_regreso: "2020-06-20",
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