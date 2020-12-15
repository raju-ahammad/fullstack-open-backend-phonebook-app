const mongoose = require('mongoose')
MONGOOSE_URL="mongodb+srv://fullstack:Ra123456@cluster0.4d8tu.mongodb.net/phonebook?retryWrites=true&w=majority"
// ****** Mongoose setup ******
const url = MONGOOSE_URL
console.log("Mongo url", url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
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