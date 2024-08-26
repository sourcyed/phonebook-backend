const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { JSON.stringify(req.body); return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(pp => response.json(pp))
})

app.get('/info', (request, response) => {
    Person.find({}).then(pp => response.send(`Phonebook has info for ${pp.length} people <br/>
        ${new Date()}`))
})

app.get('/api/persons:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(p => p ? response.json(p) : response.status(404).end)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result =>
        response.status(204).end()
    ).catch(result => response.status(404).end())
})

app.post('/api/persons', (request,response) => {
    const body = request.body
    if (!body.name)
        return response.status(400).json({error: 'name missing'})
    if (!body.number)
        return response.status(400).json({error: 'number missing'})

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})