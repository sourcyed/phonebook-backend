const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { JSON.stringify(req.body); return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
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

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br/>
        ${new Date()}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person)
        response.json(person)
    else
        response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = {...request.body}
    if (!person.name)
        return response.status(400).json({error: 'name missing'})
    if (!person.number)
        return response.status(400).json({error: 'number missing'})
    if (persons.some(p => p.name === person.name))
        return response.status(400).json({error: 'name must be unique'})

    person.id = String(Math.floor(Math.random() * 4294967296))
    persons.push(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})