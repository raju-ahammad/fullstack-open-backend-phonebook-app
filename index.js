const { request, response } = require("express");
const express = require("express")
const  morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person');
//const person = require("./models/person");

const app = express();

app.use(cors())

app.use(express.static('build'))
//json parser for access the data 
app.use(express.json())

// ************** morgan token and morgan  middleware implement ***********
morgan.token('person', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status - :response-time ms :person'))

//************* Error handleling middle ware ***********

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


app.get('/', (request, response) => {
    response.send('<h1>Hello phonebook app </h1>')
})



app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/info', (request, response) => {
  const total = persons.length;
  const date = new Date()
  response.send(`<p>Phonebook has info for ${total} people</p> <p> ${date}</p>`)
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateID = () => {
  const maxId = Person.length
 
//0 ? Math.max(...Person.map(p => p.id)) : 0;
  return maxId + 1;
}

console.log("Person Lenght", Person.length);

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
  .then(savedNote => {
    return savedNote.toJSON()
  })
  .then(savedAndFormattedNote => {
    response.json(savedAndFormattedNote)
  }) 
  .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
  console.log(`server is running on ${PORT}`);
})
