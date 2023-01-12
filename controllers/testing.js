const testingRouter = require('express').Router()
const Note = require('../models/note')
const NoteUser = require('../models/user')
testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await NoteUser.deleteMany({})
  response.status(204).end()
})
module.exports = testingRouter
