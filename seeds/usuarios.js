 const usuarios = [];
 
 const createLogin1 = () =>({
    usuario: 'ecb34@gcloud.ua.es',
    password: 'Juan',
    descuento: false
 })
 
 const createLogin2 = () =>({
    usuario: 'Juan1',
    password: 'Juan1',
    descuento: false
 })
 
 const createLogin3 = () =>({
    usuario: 'Juan2',
    password: 'Juan2',
    descuento: true
 })
 
 exports.seed = async function (knex, Promise) {
    
    usuarios.push(createLogin1());
    usuarios.push(createLogin2());
    usuarios.push(createLogin3());
    await knex('login').insert(usuarios)
 };