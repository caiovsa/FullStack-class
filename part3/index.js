const express = require('express')
require('dotenv').config()
const Person = require('./models/persons')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

var morgan = require('morgan')
// app.use(morgan('tiny'))
morgan.token('post', (req) => {
  if (req.method === 'POST') {
    return `{name: ${req.body.name}, number: ${req.body.number}}`
  }
  return ' '
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

// Error middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id format' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  response.status(500).send({ error: 'internal server error' })
}


// Usavamos essa lista quando tinhamos dados hardcoded(mooked data)
// let persons =
// [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  }).catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'person not found' })
    }
  }).catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  if (!name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!number) {
    return response.status(400).json({ error: 'number missing' })
  }
  const person = {
    name: name,
    number: number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true }).then(updatedPerson => {
    response.json(updatedPerson)
  }).catch(next)
})

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>
        `)
    })
})

// Estamos usando o mongoose para gerar o id automaticamente
// const generateId = () => {
//   return String(Math.floor(Math.random() * 1000000))
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    //id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(next)
})



// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})