require('dotenv').config()

const express = require('express')

const app = express()
app.use(express.static('build'))
const cors = require('cors')

app.use(express.json())
app.use(cors())

const Note = require('./models/note')

// fetching all notes
app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', async (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

// deleting the note resource
app.delete('/api/notes/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// creating new note
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  note.save().then((savedNote) => {
    response.json(savedNote)
  })
})

// updating note // toogling importance of note
app.put('/api/notes/:id', async (request, response, next) => {
  try {
    const body = request.body
    console.log('body is ', body)
    const note = {
      content: body.content,
      important: body.important,
    }
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
      new: true,
    })
    response.json({ updatedNote })
  } catch (error) {
    next(error)
  }
})

// example of middle ware for error handling

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
