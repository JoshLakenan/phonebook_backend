const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] //gets password from the CLI running the file
const personName = process.argv[3]
const personNumber = process.argv[4]

const database = 'phonebook';
const url = `mongodb+srv://j2lakenan:${password}@cluster0.cobpejd.mongodb.net/${database}?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)
mongoose.connect(url) //opens connection with mongoose

const personSchema = new mongoose.Schema({ //Creates a schema
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema) //creates a constructor function that is used to create
//notes of the note schema type.

if (process.argv.length === 3) {
  displayPersons()
}

if (process.argv.length === 5) {
  createPerson()
}

function createPerson () {
  const person = new Person({  //Creates a person in the phonebook
    name: personName,
    number: personNumber,
  })

  person.save().then(result => {   //Saves the person to the phonebook
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close() // closes connection with mongoose
  })
}

function displayPersons() {
  mongoose.connect(url) //opens connection with mongoose

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
