const {Work} = require('../models/index.js');

module.exports = {
  async index (req, res) {
    try {
      await Work.find({})
      .then (works => {
        // console.log(works)
        res.send(JSON.stringify(works))
      })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'Error ocurred searching works'
      })
    } 
  },
  async show (req, res) {
    try {
      console.log(req.body)
      await Work.findById(req.params.workId).select('-__v')
      .then (work => {
        console.log(work)
        res.send(JSON.stringify(work))
      })

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: `Error ocurred searching work with _id ${req.workId}`
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
  },
  async put (req, res) {
    try {
      await Work.update({_id:req.params.workId}, req.body)
      .then (work => {
        console.log(work)
        res.send(req.body)
      })

    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'Error ocurred trying to update work'
      })
    } 
  }
}