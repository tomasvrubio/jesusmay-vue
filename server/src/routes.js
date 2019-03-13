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

  app.get('/works/detail/:day/:workId',
    WorksController.show
  )

  app.get('/works/:dateStart/:dateEnd',
    WorksController.index
  )

  app.put('/works/:day/:workId',
    WorksController.put
  )

  app.delete('/works/:day/:workId',
    WorksController.delete
  )

  app.post('/works',
    WorksController.post
  )
}
