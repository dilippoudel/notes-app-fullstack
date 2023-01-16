require('dotenv').config()
const notesRouter = require('express').Router()
const User = require('../models/user')
const Note = require('../models/note')
const middleware = require('../utils/middleware')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

// deleting the note resource
notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// creating new note
notesRouter.post(
  '/',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body
    // eslint-disable-next-line no-undef
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(request.user)
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
      user: user._id,
    })
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote)
  }
)

// updating note // toogling importance of note
notesRouter.put('/:id', async (request, response) => {
  const body = request.body
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
})

module.exports = notesRouter
