const AuthenticationController = require('./controllers/AuthenticationController.js');
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

  app.get('/works',
    WorksController.index
  )

  app.get('/works/:workId',
    WorksController.show
  )

  app.put('/works/:workId',
    WorksController.put
  )

  app.post('/works',
    WorksController.post
  )
}
