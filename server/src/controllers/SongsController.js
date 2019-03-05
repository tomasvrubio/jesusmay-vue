const {Song} = require('../models/index.js');

module.exports = {
  async index (req, res) {
    try {
      const songs = await Song.find({})
      console.log(songs)
      res.send(songs.toJSON())
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'Error ocurred searching songs'
      })
    } 
  },
  async post (req, res) {
    try {
      const song = await Song.create(req.body)
      res.send(song)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'Error ocurred trying to create song'
      })
    } 
  }
}