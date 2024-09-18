import { useEffect, useState } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const [filter, setFilter] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    for (const person of persons) {
      if (person.name === newName) {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          personsService
            .update(person.id, { ...person, number: newNumber })
            .then((updatedPerson) => {
              setSuccessMessage(`Updated ${updatedPerson.name}'s number`);
              setTimeout(() => {
                setSuccessMessage(null);
              }, 5000);

              setPersons(
                persons.map((p) => (p.id === person.id ? updatedPerson : p))
              );

              setNewName("");
              setNewNumber("");
            })
            .catch((error) => {
              if (error.response) {
                setErrorMessage(error.response.data.error);
                setTimeout(() => {
                  setErrorMessage(null);
                }, 5000);
              } else {
                setErrorMessage(
                  `Information of ${person.name} has already been removed from the server`
                );
                setTimeout(() => {
                  setErrorMessage(null);
                }, 5000);

                setPersons(persons.filter((p) => p.id !== person.id));
                setNewName("");
                setNewNumber("");
              }
            });
        }
        return;
      }
    }

    personsService
      .create({ name: newName, number: newNumber })
      .then((createdPerson) => {
        setSuccessMessage(`Added ${createdPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);

        setPersons([...persons, createdPerson]);
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .deletePerson(person.id)
        .then(() => setPersons(persons.filter((p) => p.id !== person.id)));
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage} styles="success" />
      <Notification message={errorMessage} styles="error" />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
