const jwt = require('jsonwebtoken');
const User = require('../modules/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.accessTokenJwt

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'secret jwt key', (err, decodedToken) => {
            if (err) res.redirect('/login'); else next()
        })
    } else res.redirect('/login')
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.accessTokenJwt
    if (token) {
        jwt.verify(token, 'secret jwt key', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                next()
            } else {
                const user = await User.findById(decodedToken.id)
                user['isAuth'] = true
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser }