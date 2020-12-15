const mongoose = require('mongoose')

// ****** Mongoose setup ******
const url = process.env.MONGOOSE_URL
console.log("Mongo url", url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: {
      type: String,
      minlength: 3,
      required: true
  },
  number:{
      type: String,
      maxlength: 11,
      required: true
  },
  id: Number
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
module.exports = mongoose.model('Person', personSchema)