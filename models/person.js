// 3.13: Phonebook database, step 1 -  fetching of all phonebook entries so that the data is fetched from the database.
// 3.14: Phonebook database, step 2 - Change the backend so that new numbers are saved to the database.

const mongoose = require('mongoose')

mongoose.set("strictQuery", false) // This is to avoid the deprecation warning.

const url = process.env.MONGODB_URI
console.log('Connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(0\d{1,2}-\d{6,})$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
})

personSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)