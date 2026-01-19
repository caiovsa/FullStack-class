const mongoose = require('mongoose')

// Se tivermos menos de 3 argumentos (node, arquivo, senha(Seria o terceiro)), sair
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

// Pega a senha, nome e número dos argumentos
// Ex: node mongo.js <password> <name> <number>
// 0: node
// 1: mongo.js
// 2: <password>
// 3: <name>
// 4: <number>
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =  `mongodb+srv://caiovsa:${password}@fullstack.coz2ixk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Fullstack`


mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Se tiver só a senha, listar todos os contatos
// Se tiver nome e número, adicionar o contato
// Se tiver so o nome ele adiciona com número undefined
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}