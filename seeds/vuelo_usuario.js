 const usuarios = [];
 
 const createLogin1 = () =>({
    usuario: 'Juan',
    password: 'Juan'
 })
 
 const createLogin2 = () =>({
    usuario: 'Juan1',
    password: 'Juan1'
 })
 
 const createLogin3 = () =>({
    usuario: 'Juan2',
    password: 'Juan2'
 })
 
 exports.seed = async function (knex, Promise) {
    
    usuarios.push(createLogin1());
    usuarios.push(createLogin2());
    usuarios.push(createLogin3());
    await knex('login').insert(usuarios)
 };