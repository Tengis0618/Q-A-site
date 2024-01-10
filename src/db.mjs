import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [String]
})

console.log('connecting to database', process.env.DSN)
mongoose.connect(process.env.DSN)

const Question = mongoose.model("Questions", QuestionSchema)
export default Question
