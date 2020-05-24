const hotel = [];

const res1 = () => ({
   fecha_checkin: "10-10-10",
   fecha_checkout: "11-10-10",
   tipo_habitacion: "doble cama",
   cama_supletoria: true,
   precio: 200
})

const res2 = () => ({
   fecha_checkin: "11-10-10",
   fecha_checkout: "14-10-10",
   tipo_habitacion: "doble cama",
   cama_supletoria: true,
   precio: 100
})

const res3 = () => ({
   fecha_checkin: "12-10-10",
   fecha_checkout: "15-10-10",
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