import React, {useState, useEffect} from 'react'
import axios from 'axios'
import personsService from './services/persons'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchName, setSearchName] = useState('')
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)
    


    const showMessage = (message) => {
      setNotification(message)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

    const showError = (error) => {
      setError(error)
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
    

    useEffect(() => {
      console.log('Effect')
      personsService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
    }, [])
    
    console.log('render', persons.length, 'persons')
    

    const addPerson = (event) => {
      event.preventDefault()
      const personExists = persons.find(person => person.name === newName ) // Check if name already exists in phonebook
      if (personExists) { 
          const result = window.confirm(`${newNumber} is already added to phonebook, replace the old number with a new one?`)
            if (result){
              const changedPerson = {...personExists, number: newNumber}
              personsService
                .update(personExists.id, changedPerson)
                .then(returnedPerson => {
                  setPersons(persons.map(person => person.id !== personExists.id ? person : returnedPerson)) // Update the number
                  showMessage(`Updated ${newName}`)
                })
                .catch(error => {
                  showError(`Information of ${newName} has already been removed from the server`)
                  setPersons(persons.filter(person => person.id !== personExists.id)) // Remove the person from the list
                })
            }
      } else {
          personsService
            .create({name: newName, number: newNumber})
            .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson))
              showMessage(`Added ${newName}`)
            })
        setNewName('') 
        setNewNumber('') 
      }
    }

    const deletePerson = (id) => {
      console.log('delete person' + id + ' needs to be toggled')
      const person = persons.find(n => n.id === id)
      console.log(person)
      if (person){
        const result = window.confirm(`Delete ${person.name}?`)
        if (result) {
          personsService
            .remove(id)
            .then(response => {
              setPersons(persons.filter(person => person.id !== id))
            })
        }
      }
    }


    const handleNameChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
      console.log(event.target.value)
      setNewNumber(event.target.value)
    }

    const handleSearchChange = (event) => {
      console.log(event.target.value)
      setSearchName(event.target.value)
    }

    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))
    

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notification} error={error} />
            <Filter value={searchName} onChange={handleSearchChange}/>


            <h2>add a new</h2>
            <PersonForm 
              onSubmit={addPerson}
              nameValue={newName}
              numberValue={newNumber}
              nameChange={handleNameChange}
              numberChange={handleNumberChange}
            />


            
            <h2>Numbers</h2>
            
            {filteredPersons.length > 0 ? (
              <Person 
                persons={filteredPersons}
                onClick={deletePerson}
              />
            ) : (
              <p>There is no person here</p>
            )}
            
        </div>
    )
}

export default App