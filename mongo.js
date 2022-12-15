const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>',
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://dilip123:${password}@cluster0.kjjfsfr.mongodb.net/fsd5?retryWrites=true&w=majority`
mongoose.set('strictQuery', true)
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    // const note = new Note({
    //   content: 'HTML is Easy',
    //   date: new Date(),
    //   important: true,
    // })
    Note.find({}).then((res) => {
      res.forEach((note) => {
        console.log(note)
      })
      mongoose.connection.close()
    })
    // return note.save()
  })
  //   .then(() => {
  //     console.log('note saved!')
  //     return mongoose.connection.close()
  //   })
  .catch((err) => console.log(err))
