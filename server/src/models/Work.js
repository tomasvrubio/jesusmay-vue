var mongoose = require('mongoose');

var workSchema = mongoose.Schema({
  name: {type: String, required: true},
	email: {type: String, required: true},
  phone: {type: String, required: true},
  datePicked: {type: Date, required: true},
  category: {type: String, required: true},
  notes: {type: String},
  state: {type: String},
  created: {type:Date, default:Date.now},
  updated: {type: Date},
})

workSchema.pre('save', function(next){
  this.updated = Date.now()
  next()
})

var Work = mongoose.model('Work', workSchema)
module.exports = Work
