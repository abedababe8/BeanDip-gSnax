const knex = require('../../db/knex');
const bcrypt = require('bcrypt-as-promised')


function getUserByEmail(email){
  console.log(email, "made it to getUserbyemiail models")
  return (
    knex('users')
    .where({ email })
    .first()
  )
}

function getOne(usersId){
  console.log(usersId, "made it to getOne model")
  return (
    knex('users')
    .where({ id: usersId })
    .first()
  )
}

function create(body){
  let password = body.password
  let first_name = body.fname
  let last_name = body.lname
  let email = body.email
  let admin = body.admin || false

  return getUserByEmail(email)
  .then(data => {
    if(data) throw { status: 400, message:'Already exists'}
    return bcrypt.hash(password, 10)
  })
  .then(newPassword => {
    console.log("made it to after hashed password- model")
    return (
      knex('users')
      .insert({ first_name, last_name, email, hashed_password:newPassword, admin})
      .returning('*')
    )
  })
  .then(function([ {password, ...data} ]){
    return data
  })
}

function remove(usersId){
  console.log("made it to remove models")
  let usersid = usersId
  return (
    knex('users')
    .where({
      id: usersid
    })
    .del()
  )
}

function update(){

}

module.exports = {getOne, create, update, remove, getUserByEmail}
