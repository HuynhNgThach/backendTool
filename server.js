const express = require('express')
const cors = require('cors')
const coookieParser = require('cookie-parser')
const cookieParser = require('cookie-parser')
const errHandlers = require('./_middlewares/error-handler')
const usercontroller = require('./users/user.controller')


// create test account
const createTestUser = require('./_helpers/createTestUser')
createTestUser()


const app = express()
    // use middlewares
    // allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use(usercontroller)

// use global error handler
app.use(errHandlers)

// start app
app.listen(4000, () => {
    console.log("Backend is running")
})