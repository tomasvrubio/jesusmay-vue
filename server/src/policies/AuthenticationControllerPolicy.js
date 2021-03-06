const Joi = require('joi');

module.exports = {
  register (req, res, next) {
    const schema = {
      name: Joi.string().alphanum().min(3).max(30),
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      )
    }
    
    const {error, value} = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'name':
          res.status(400).send({
            error: 'You must provide a valid name.'
          })
          break
        case 'email':
          res.status(400).send({
            error: 'You must provide a valid email address.'
          })
          break
        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
              <br>
              1. It must contain ONLY: lower case, upper case, numbers.
              <br>
              2. It must be at least 8 characters in length and not greater than 32.
            `
          })
          break
        default:
          res.status(400).send({
            error: 'Invalid registration information'
          })
          break
      }
    } else {
      next()
    }

  }
}