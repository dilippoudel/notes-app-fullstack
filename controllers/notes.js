const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', async (req, res, next) => {
  const note = await Note.findById(req.params.id)
  try {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
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
notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

// updating note // toogling importance of note
notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  console.log('body is ', body)
  const note = {
    content: body.content,
    important: body.important,
  }
  try {
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
