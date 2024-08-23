const mongoose = require('mongoose')
const args = process.argv

if (args.length < 3) {
    console.log('give password as an argument')
    return
}
if (args.length === 4) {
    console.log('phone number missing')
    return
} 

const password = args[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.ldj2t.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluste`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const displayEntries = () => {
    Person.find({}).then(r => {
        console.log('phonebook:')
        r.forEach(p => {
            console.log(p.name, p.number)
        })
        mongoose.connection.close()
    })
}

const addEntry = (name, number) => {
    const newPerson = new Person({
        name, number
    })
    newPerson.save().then(r => {
        console.log(`added ${r.name} number ${r.number} to phonebook`)
        mongoose.connection.close()
    })
}

if (args.length === 3) {
    displayEntries()
}
else {
    addEntry(args[3], args[4])
}