
// 3.15: Phonebook database, step 3
// 3.16: Phonebook database, step 4
// 3.17*: Phonebook database, step 5



require('dotenv').config() 

const express = require('express')
const cors = require('cors') 
const Person = require('./models/person')
const app = express()



app.use(express.static('dist'))
app.use(express.json())
app.use(cors()) // Use cors to allow requests from other origins

// requestLogger middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}



app.use(requestLogger) // The requestLogger middleware is used to log information about the requests that are made to the server.



// GET request - root
app.get('/', (request, response) => { 
    response.send('<h1>Phonebook Backend</h1>')
})

// GET request - persons
app.get('/api/persons', (request, response) => { 
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// GET request - info
app.get('/info', (request, response) => { 
    const date = new Date() // Get the current date
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`
    )
})

// GET request - persons/:id
app.get('/api/persons/:id', (request, response, next) => { 
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
         })
         .catch(error => next(error))
})

// DELETE request - persons/:id
app.delete('/api/persons/:id', (request, response, next) => { // Define a route handler for the path /api/persons/:id
   Person.findByIdAndDelete(request.params.id)
        .then (result => {
            response.status(204).end()
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
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})



// POST request - persons
app.post('/api/persons', (request, response, next) => { // Define a route handler for the path /api/persons
    const body = request.body

    if(!body.name || !body.number) { // If the name is missing, return an error
        return response.status(400).json({
            error:'name or number is missing'
        })
    }
    

    Person.find({name: body.name}).then(persons => {
        if(persons.length > 0) {
            return response.status(400).json({
                error: 'The name already exists in the phonebook'
            })
        } else {
            const person = new Person({ // Create a new person object
                name: body.name,
                number: body.number
            })
        
            person.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
                .catch(error => next(error))
        }
    })
})




// unknownEndpoint middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ 
        error: 'unknown endpoint' 
    })
}

// errorHandler middleware
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if( error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}


app.use(unknownEndpoint) // The unknownEndpoint middleware is used to catch requests made to unknown routes.
app.use(errorHandler) // The errorHandler middleware is used to catch errors in request handling.


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
