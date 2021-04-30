const db = require('../_helpers/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config.json')
const crypto = require('crypto')


module.exports = {
    authenticate
}
async function authenticate({ username, password, ipAddress }) {
    const user = await db.User.findOne({ username })
    console.log('from service', username, password);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw "Username or password is incorrect"
    }

    // authenticate successful -> generate jwt token
    const jwtToken = generateJwtToken(user)
    const refreshToken = generateRefreshToken(user, ipAddress)
    refreshToken.save()

    return {
        ...basicDetails(user),
        jwtToken,
        refreshToken: refreshToken.token
    }

}

function basicDetails(user) {
    const { id, username, lastname, firstname, role } = user
    return { id, username, lastname, firstname, role }
}

function generateRefreshToken(user, ipAddress) {
    // create new refresh token expire in 7 day
    return new db.RefreshToken({
        user: user.id,
        token: randomToken(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    })
}

function randomToken() {
    return crypto.randomBytes(40).toString('hex');
}

function generateJwtToken(user) {
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' })
}