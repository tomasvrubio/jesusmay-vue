var mongoose = require('mongoose')

var calendarSchema = mongoose.Schema({
  day: {type: String, required: true, unique: true},
  vacation: {type: Boolean, required: true, default: false},
  slots: [{
    hour: {type: String, required: true},
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    datePicked: {type: Date, required: true},
    category: {type: String},
    notes: {type: String},
    state: {type: String},
    inserted: {type: Date, default: Date.now},
  }]
},{
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})

var Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar