const {
  mongoose,
  User,
  Work
} = require('../src/models')

const works = require('./works.json')
const users = require('./users.json')
const Promise = require('bluebird')

// TODO: Aquí haré la carga inicial de las tablas. eL HACE:
// Video 6 - Minuto 30 +-


sequelize.sync({force: true})
  .then(async function() {
    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )

    await Promise.all(
      works.map(song => {
        Work.create(song)
      })
    )
  })