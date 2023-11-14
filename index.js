const express = require('express');
const app = express();
const cors = require('cors');

// const morgan = require('morgan');
// morgan.token('body', (req) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time[3] :body'));

const persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

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


app.use(express.static('dist'));
app.use(cors()); // allow request from all origins

app.use(express.json()); //json parser

app.get('/', (req, res) => {
  res.redirect('/api/persons');
})

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === Number(req.params.id));

  if (!person) res.status(404).send('Record not found.');

  res.json(person);
})

app.get('/info', (req, res) => {
  let message = `<p>Phonebook has info for ${persons.length} people.`;
  message += `<br/><br/>${new Date()}</p>`;

  res.set('Content-Type', 'text/html');
  res.send(message);
})

app.delete('/api/persons/:id', (req, res) => {
  let removed = persons.splice(persons.findIndex(p => p === Number(req.params.id)), 1);
  console.log('Removed: ', removed);
  res.status(204).end();
});


app.post('/api/persons', (req, res) => {
  let newPerson = req.body;

  if (invalidPost(req)) return res.status(400).send(invalidPost(req));

  const id = Math.floor(Math.random() * 1000000000000000);
  newPerson = {...newPerson, id};

  persons.push({...newPerson, id});

  res.status(201).json(newPerson);
})

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});