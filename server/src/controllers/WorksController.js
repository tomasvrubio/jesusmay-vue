const {Work} = require('../models/index.js');

module.exports = {
  async index (req, res) {
    try {
      await Work.find({})
      .then (works => {
        console.log(works)
        res.send(JSON.stringify(works))
      })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'Error ocurred searching works'
      })
    } 
  },
  async post (req, res) {
    try {
      await Work.create(req.body)
      .then (work => {
        console.log(work)
        res.send(JSON.stringify(work))
      })

    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'Error ocurred trying to create work registration'
      })
    } 
  }
}