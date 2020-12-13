const { request, response } = require("express");
const express = require("express")
const  morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express();
app.use(cors())


//json parser for access the data 
app.use(express.json())

morgan.token('person', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status - :response-time ms :person'))


let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello phonebook app </h1>')
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
  const total = persons.length;
  const date = new Date()
  response.send(`<p>Phonebook has info for ${total} people</p> <p> ${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log("Id:", id);
  const person = persons.find(person => person.id == id)
  console.log("person:", person);
  if (person) {
    response.json(person)
  }else{
    response.status(400).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(400).end()
})

const generateID = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
 
  return maxId + 1;
}

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }
  persons.find(p => {
    if (p.name === body.name) {
      return response.status(400).json({
        error: `${body.name} is already exist. name must be unique`
      })
    }
  })
  
  const person = {
    name: body.name,
    number: body.number,
    id : generateID() 
  }

  response.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
  console.log(`server is running on ${PORT}`);
})
