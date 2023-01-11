const usersRouter = require('express').Router()
const NoteUser = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
  const users = await NoteUser.find({}).populate('notes', {
    content: 1,
    date: 1,
  })
  res.json(users)
})
usersRouter.get(':id', async (req, res) => {
  const user = await NoteUser.findById(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
usersRouter.delete(':/id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id)
  res.status(204).end()
})
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const existingUser = await NoteUser.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new NoteUser({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})
module.exports = usersRouter
