const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
	name:{
		type: String,
		trim: true,
		required: true,
		maxlength: 32
	},
	email:{
		type: String,
		trim: true,
		required: true,
		unique: true
	},
	hashed_password:{
		type: String,
		required: true,
	},
	about:{
		type: String,
		trim: true,
		maxlength: 255
	},
	salt: String,
	role:{
		type: Number,
		default:0
	},
	history:{
		type: Array,
		default: []
	}
}, { timestamps: true });

// Virtual Field
// It's coming from frontend or via postman password field.
userSchema.virtual('password')
.set(function (password) {
	// Temp variable _password
	this._password = password
	this.salt = uuidv4()
	this.hashed_password = this.encryptPassword(password)
})
.get(() => {
	return this._password
});

// Methods
userSchema.methods = {
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},
	encryptPassword: function (password) {
	  if (!password) return '';
	  try {
	    return crypto.createHmac('sha1', this.salt)
	      .update(password)
	      .digest('hex');
	  } catch (err) {
	    return '';
	  }
	}	
};
   


module.exports = mongoose.model('User', userSchema);
