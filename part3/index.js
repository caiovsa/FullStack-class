const express = require('express')
const app = express()
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

let persons =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const note = persons.find(note => note.id === id)
    if (note) {
        response.json(note)  
    } else {    
        response.status(404).end()  
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  console.log(persons)
  response.status(204).end()
})


app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `)
    // const firstPart = `<p>Phonebook has info for ${persons.length} people</p>`
    // const secondPart = `<p>${new Date()}</p>`
    // response.send(firstPart + secondPart)
})

const generateId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name and number missing' 
    })
  }
    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

  const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})



// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})