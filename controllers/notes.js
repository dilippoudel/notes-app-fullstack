const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

notesRouter.get('/:id', async (req, res, next) => {
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
notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// creating new note
notesRouter.post('/', (request, response, next) => {
  const body = request.body
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  note
    .save()
    .then((savedNote) => {
      response.json(savedNote)
    })
    .catch((error) => next(error))
})

// updating note // toogling importance of note
notesRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body
    console.log('body is ', body)
    const note = {
      content: body.content,
      important: body.important,
    }
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
      new: true,
      runValidators: true,
      context: 'query',
    })
    response.json({ updatedNote })
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
