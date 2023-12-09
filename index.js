const express = require('express')
const apikeyRoutes = require('./routes/apiKey.js')
const userRoutes = require('./routes/user.js')
const questionRoutes = require('./routes/question.js')
const categoryRoutes = require('./routes/category.js')

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const port = 3000

app.use('/apikey', apikeyRoutes)
app.use('/user', userRoutes)
app.use('/question', questionRoutes)
app.use('/category', categoryRoutes)

app.listen(port,()=>{
    console.log('Server start')
})
// admin aaafbb43-94e1-424a-893c-657a9aca2522