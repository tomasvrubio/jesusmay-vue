var mongoose = require('mongoose')

var calendarSchema = mongoose.Schema({
  day: {type: String, required: true},
  vacation: {type: Boolean, required: true, default: false},
  slots: [{
    hour: {type: String, required: true},
    work: String,
    added: {type: Date, default: Date.now},
    // name: {type: String, required: true},
    // email: {type: String, required: true},
    // phone: {type: String, required: true},
    // datePicked: {type: Date, required: true},
    // category: {type: String, required: true},
    // notes: {type: String},
    // state: {type: String},
  }]
},{
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

var Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar