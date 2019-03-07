var mongoose = require('mongoose');

var workSchema = mongoose.Schema({
  name: {type: String, required: true},
	email: {type: String, required: true},
  phone: {type: String, required: true},
  datePicked: {type: Date, required: true},
  category: {type: String, required: true},
  notes: {type: String},
  state: {type: String},
},{
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

var Work = mongoose.model('Work', workSchema)
module.exports = Work
