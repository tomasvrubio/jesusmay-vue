var mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  saltRounds = 10;

var userSchema = mongoose.Schema({
  // name: {type: String, required: true, trim: true},
	email: {type: String, required: true, unique:true},
  password: {type: String, required: true},
	role: {type: String, default: "nobody"},
	created: {type:Date, default:Date.now},
})

userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(saltRounds), null)
  next()
})

//TODO: Después de meter el pre-save, ¿voy a utilizar esto en algún caso? Si no lo utilizo en regeneración contraseña habría que borrarlo.
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds), null)
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
   return bcrypt.compareSync(password, this.password)
}

var User = mongoose.model('User', userSchema)
module.exports = User
