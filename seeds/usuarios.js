 const usuarios = [];
 
 const createLogin1 = () =>({
    usuario: 'ecb34@gcloud.ua.es',
    password: '1234',
    descuento: false
 })
 
 const createLogin2 = () =>({
    usuario: 'bttajuan@hotmail.com',
    password: '1234',
    descuento: false
 })
 
 const createLogin3 = () =>({
    usuario: 'eduardocorreal@hotmail.com',
    password: '1234',
    descuento: true
 })
 
 exports.seed = async function (knex, Promise) {
    
    usuarios.push(createLogin1());
    usuarios.push(createLogin2());
    usuarios.push(createLogin3());
    await knex('login').insert(usuarios)
 };