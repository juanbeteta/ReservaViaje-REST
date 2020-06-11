const hotel = [];

const res1 = () => ({
   nombre: "Ibi",
   fecha_checkin: "2020-06-13",
   fecha_checkout: "2020-06-20",
   tipo_habitacion: "doble cama",
   cama_supletoria: true,
   precio: 200
})

const res2 = () => ({
   nombre: "Melia",
   fecha_checkin: "2020-06-13",
   fecha_checkout: "2020-06-18",
   tipo_habitacion: "doble cama",
   cama_supletoria: true,
   precio: 100
})

const res3 = () => ({
   nombre: "El encuentro",
   fecha_checkin: "2020-06-13",
   fecha_checkout: "2020-06-15",
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