const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
        .then(() => console.log('connected to MongoDB'))
        .catch(error => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({ //Creates a schema
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//creates and exports the constructor function for createing new documents, and interacting
//with the person database.
module.exports = mongoose.model('Person', personSchema);