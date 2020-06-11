const coches = [];
//reserva_id, fecha_recogida, fecha_devolucion, lugar_recogida, lugar_devolucion, tanque_lleno, precio
const coche1 = () => ({
   nombre: "Ferrari 488",
   fecha_recogida: "2020-06-13",
   fecha_devolucion: "2020-06-14",
   lugar_recogida:  "Alicante",
   lugar_devolucion: "Madrid",
   tanque_lleno: true,
   precio: 250
})

const coche2 = () => ({
   nombre: "Honda Civic",
   fecha_recogida: "2020-06-13",
   fecha_devolucion: "2020-06-15",
   lugar_recogida:  "Alicante",
   lugar_devolucion: 'Madrid',
   tanque_lleno: true,
   precio: 50
})

exports.seed = async function (knex, Promise) {

   coches.push(coche1());
   coches.push(coche2());
   await knex('coche').insert(coches)
};