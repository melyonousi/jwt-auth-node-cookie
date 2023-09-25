const User = require('../modules/User')
const jwt = require('jsonwebtoken')

// handle erros
const handleErros = (err) => {
    // validatio errors
    let errors = {}

    // incorrect email
    if (err.message === 'incorrect email') {
        errors['email'] = 'email not exist, try to signup with this email'
    }
    // incorrect password
    if (err.message === 'incorrect password') {
        errors['password'] = err.message
    }

    // duplicate error code
    if (err.code === 11000) {
        errors['email'] = 'that eamil is already registered'
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

// handle create token
//days hours minutes seconds
const maxAge = 3 * 24 * 60 * 60
const accessTokenJwt = 'accessTokenJwt'
const createToken = (id) => {
    return jwt.sign({ id }, 'secret jwt key', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.signup_post = async (req, res) => {
    const { name, email, password, avatar } = req.body

    try {
        const user = await User.create({ name, email, password, avatar })
        const token = createToken(user._id)
        // maxAge in seconds so multiple in 1000 to equal 3 days
        res.cookie(accessTokenJwt, token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({
            success: 'registered with success',
            user: user._id
        })
    } catch (err) {
        const error = handleErros(err)
        res.status(400).json({ errors: error })
    }
}

module.exports.login_get = (req, res) => {
    res.render('login')
}
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        // maxAge in ms so multiple in 1000 to equal 3 days
        res.cookie(accessTokenJwt, token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({
            success: 'logged with success',
            user: user,
        })
    } catch (err) {
        const errors = handleErros(err)
        res.status(400).json({ errors: errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie(accessTokenJwt, '', { maxAge: 1 })
    res.redirect('/')
}

module.exports.profile_get = (req, res) => {
    res.render("profile")
}