require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person.js');

// const morgan = require('morgan');
// morgan.token('body', (req) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time[3] :body'));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
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

  new Person(newPerson)
    .save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(error => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
  const updatedPerson = {
    name: req.body.name,
    number: req.body.number,
  }
  Person.findByIdAndUpdate(
    req.params.id,
    updatedPerson,
    {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
})

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});