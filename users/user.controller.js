const express = require('express')
const router = express.Router();
const authorize = require('../_middlewares/authorize')
const Joi = require('joi')
const validateRequest = require('../_middlewares/validate-request')
const userService = require('../users/user.service')


// route
router.post("/authen", authenticateSchema, authenticate)
    // router.get('/:id', authorize(), getById)

module.exports = router

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
    validateRequest(req, next, schema)
}
async function authenticate(req, res, next) {
    const { username, password } = req.body
    console.log("form authenticate controller", username, password)
    const ipAddress = req.ip
    try {
        const { refreshToken, ...user } = await userService.authenticate({ username, password, ipAddress })
        setTokenCookie(res, refreshToken)
        res.json(user)
    } catch (error) {
        console.log(error)
        next(error)
    }

}

function setTokenCookie(res, token) {
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    res.cookie('refreshToken', token, options)
}