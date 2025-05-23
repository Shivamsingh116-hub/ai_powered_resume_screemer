const http = require('http')
const express = require('express')
const app = express()
const CORS = require('cors')
const path = require('path')
const router = require('./routes/userRoute')
const mongoose = require('./database/dbConnection')
const server = http.createServer(app)
require('dotenv').config()
app.use(CORS(
    {
        origin: [process.env.LOCALHOST_URL, process.env.FRONTEND_URL],
        credentials: true
    }
))
const port = process.env.PORT
app.use(express.json())
app.use(router)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get('/test', (req, res) => {
    res.send('WORKING')
})
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})