const mongoose = require('mongoose');
const { Schema } = mongoose;  
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true,
    default: 'user'
  },
  addresses: {
    type: [Schema.Types.Mixed]
  },
  name: {
    type: String
  },
});

//bcryptJS:
userSchema.pre('save', async function (next) { //pre is a middleware to be called before 'save' function
  const user = this //represents the entry of the userSchema which is being saved

  //hash the password only if it has been modified or is new
  if(!user.isModified('password')) return next()

  try { 
      //hash password generation
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(user.password,salt)
      user.password = hashedPassword
      next()
  } catch (error) {
      return next(error)
  }   
})
userSchema.methods.comparePassword = async function (candidatePassword){
  try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password)
      return isMatch
  } catch (error) {
      throw error
  }
}

const virtual = userSchema.virtual('id');
//This line creates a virtual property named 'id' on the userSchema
//DB wont have this field as it is virtual. It is derived from '_id'

virtual.get(function () { //we can't use arrow functions as we use 'this' keyword 
  return this._id
});

userSchema.set('toJSON', { //to convert mongoose document into JSON format
  virtuals: true, //virtual properties to be included in the JSON format
  versionKey: false, //no mongoose version key
  transform: function (doc, ret) {
    //doc refers to the original Mongoose document 
    //ret refers to the tranformed JSON representation of the mongoose document

    delete ret._id;
    //we delete _id from the response, not from the DB. In the DB, it is still stored as _id as 'id' is a virtual property
  },
});

exports.User = mongoose.model('User', userSchema);
