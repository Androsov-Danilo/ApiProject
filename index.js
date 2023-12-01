const express = require('express')
const apikeyRoutes = require('./routes/apiKey.js')
const userRoutes = require('./routes/user.js')

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const port = 3000

app.use('/apikey', apikeyRoutes)
app.use('/user', userRoutes)

app.listen(port,()=>{
    console.log('Server start')
})