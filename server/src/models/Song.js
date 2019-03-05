var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
  title: {type: String},
  artist: {type: String},
  genre: {type: String},
  album: {type: String},
  albumImage: {type: String},
  youtubeId: {type: String},
  lyrics: {type: String},
  tab: {type: String},
})


var Song = mongoose.model('Song', songSchema)
module.exports = Song
