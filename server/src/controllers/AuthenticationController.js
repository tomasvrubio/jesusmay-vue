const {User} = require('../models/index.js'),
      jwt = require('jsonwebtoken'),
      config = require('../config/config');

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    try {
      const user = await User.create(req.body)
      console.log(user)
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'Email en uso.'
      })
    }
  },
  async login (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({email})
      if (!user) {
        return res.status(403).send({
          error: 'The login info was incorrect'
        })
      }

      const isPasswordValid = await user.validPassword(password)
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'The login info was incorrect'
        })
      }

      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'Error has ocurred trying to login'
      })
    }
  },
  // TODO: Aquí me he anticipado para lo que voy a necesitar
  async changePass (req, res) {
    try {
      const {email, newPassword} = req.body
      const user = await User.findOne({email})

      // user.password = user.generateHash(newPassword)
      user.password = newPassword

      await user.save()
      const userJson = user.toJSON()
      res.send({
        user: userJson
      })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'Error has ocurred trying to change password'
      })
    }   
  }
}