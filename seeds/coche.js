const coches = [];
//reserva_id, fecha_recogida, fecha_devolucion, lugar_recogida, lugar_devolucion, tanque_lleno, precio
const coche1 = () => ({
   fecha_recogida: "10-10-10",
   fecha_devolucion: "11-10-10",
   lugar_recogida:  "alicante",
   lugar_devolucion: "madrid",
   tanque_lleno: true,
   precio: 50
})

exports.seed = async function (knex, Promise) {

   coches.push(coche1());
   await knex('coche').insert(coches)
};