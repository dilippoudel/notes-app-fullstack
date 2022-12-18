require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log('connecting to ', url)
mongoose.set('strictQuery', true) // to avaoid the mongoose warnings

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((err) => console.log('error: ', err.message))

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
})
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('Note', noteSchema)