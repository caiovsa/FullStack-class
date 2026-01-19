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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'person not found' })
    }
  }).catch(error => {
    response.status(400).json({ error: 'invalid id format' })
  })
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

app.post('/api/persons', (request, response) => {
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
  })
})



// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})