require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person.js');

// const morgan = require('morgan');
// morgan.token('body', (req) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time[3] :body'));

const invalidPost = (req) => {
  let newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return {error: 'Name and Number are required'};
  }

  if (persons.find(p => p.name === newPerson.name)) {
    return {error: 'Name must be unique'};
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.log(error)
  res.status(500).end();
}


app.use(express.static('dist'));
app.use(cors()); // allow request from all origins\
app.use(express.json()); //json parser

app.get('/', (req, res) => {
  res.redirect('/api/persons');
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(returnedPerson => res.json(returnedPerson))
    .catch(error => next(error));
})

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      let message = `<p>Phonebook has info for ${persons.length} people.`;
      message += `<br/><br/>${new Date()}</p>`;

      res.set('Content-Type', 'text/html');
      res.send(message);
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
});


app.post('/api/persons', (req, res, next) => {
  let newPerson = req.body;

  // if (invalidPost(req)) return res.status(400).send(invalidPost(req));

  new Person(newPerson)
    .save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(error => next(error));
})

app.put('/api/persons/:id', (req, res) => {
  const updatedPerson = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.findByIdAndUpdate(req.params.id, updatedPerson, {new: true})
    .then(updatedPerson => res.json(updatedPerson));
})

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});