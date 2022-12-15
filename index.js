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

app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    res.send(note)
  } else {
    res.status(404).end()
  }
})

// deleting the note resource
app.delete('/api/notes/:id', async (req, res) => {
  const result = await Note.findByIdAndDelete(req.params.id)

  res.status(204).end()
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

// updating note
app.put('/api/notes/:id', async (request, response) => {
  const note = Note.findByIdAndUpdate(
    request.params.id,
    { $set: request.body },
    (err) => {
      if (err) {
        return response.json({ error: 'Something went wrong' })
      }
      response.send('product updated')
    },
  )
  console.log('request body is ', request.body)
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
