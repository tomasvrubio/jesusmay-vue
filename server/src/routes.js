const AuthenticationController = require('./controllers/AuthenticationController.js');

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy.js');

module.exports = (app) => {

  app.get('/status', (req, res) => {
    res.send({
      message: "hello world",
    })
  })
  
  app.post('/register',
    AuthenticationControllerPolicy.register, 
    AuthenticationController.register
  )

  app.post('/login',
    AuthenticationController.login
  )

  app.post('/changePass',
  AuthenticationController.changePass
)

}
