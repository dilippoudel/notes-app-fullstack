const bcrypt = require('bcrypt')
const User = require('../models/user')
const config = require('../utils/config')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
describe('When there is initially one user in db', () => {
  beforeEach(async () => {
    await mongoose.connect(config.MONGODB_URI)
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  }, 1000000)
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = helper.usersInDb()
    const newUser = {
      username: 'dilip123',
      name: 'Dilip Poudel',
      password: 'dilip123',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength((await usersAtStart).length + 1)
    const usersnames = usersAtEnd.map((user) => user.username)
    expect(usersnames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already exits in database', async () => {
    const usersAtStart = helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'SuperUser',
      password: 'salainen',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('username must be unique')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
