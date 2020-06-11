const vuelos = [];

const vuelo1 = () => ({
   nombre: "Ryan Air",
   fecha_ida: "2020-06-13",
   fecha_regreso: "2020-06-15",
   cantidad_personas: 100,
   lugar_origen: "Alicante",
   lugar_destino: "Madrid",
   precio: 50
})

const vuelo2 = () => ({
   nombre: "Iberia",
   fecha_ida: "2020-06-13",
   fecha_regreso: "2020-06-22",
   cantidad_personas: 100,
   lugar_origen: "Alicante",
   lugar_destino: "Londres",
   precio: 100
})

const vuelo3 = () => ({
   nombre: "Lufthansa",
   fecha_ida: "2020-06-13",
   fecha_regreso: "2020-06-20",
   cantidad_personas: 100,
   lugar_origen: "Alicante",
   lugar_destino: "Dusseldorf",
   precio: 80
})

const vuelo4 = () => ({
   nombre: "Ryan Air",
   fecha_ida: "2020-06-13",
   fecha_regreso: "2020-06-21",
   cantidad_personas: 100,
   lugar_origen: "Madrid",
   lugar_destino: "Roma",
   precio: 70
})

exports.seed = async function (knex, Promise) {

   vuelos.push(vuelo1());
   vuelos.push(vuelo2());
   vuelos.push(vuelo3());
   vuelos.push(vuelo4());
   await knex('avion').insert(vuelos)
};