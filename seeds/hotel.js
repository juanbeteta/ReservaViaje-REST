const hotel = [];

const res1 = () => ({
   nombre: "hotel1",
   fecha_checkin: "2020-10-10",
   fecha_checkout: "2020-10-10",
   tipo_habitacion: "doble cama",
   cama_supletoria: true,
   precio: 200
})

const res2 = () => ({
   nombre: "D'Angelo",
   fecha_checkin: "2020-10-10",
   fecha_checkout: "2020-10-10",
   tipo_habitacion: "doble cama",
   cama_supletoria: true,
   precio: 100
})

const res3 = () => ({
   nombre: "El encuentro",
   fecha_checkin: "2020-10-10",
   fecha_checkout: "2020-10-10",
   tipo_habitacion: "doble cama",
   cama_supletoria: true,
   precio: 300
})

exports.seed = async function (knex, Promise) {

   hotel.push(res1());
   hotel.push(res2());
   hotel.push(res3());
   await knex('hotel').insert(hotel)
};