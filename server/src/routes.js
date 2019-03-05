const AuthenticationController = require('./controllers/AuthenticationController.js');
const SongsController = require('./controllers/SongsController.js');
const WorksController = require('./controllers/WorksController.js');

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

  app.get('/songs',
    SongsController.index
  )

  app.post('/songs',
    SongsController.post
  )

  app.get('/works',
    WorksController.index
  )

  app.post('/works',
    WorksController.post
  )
}
