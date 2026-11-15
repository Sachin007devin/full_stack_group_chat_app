const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signInUser = async (data) => {
    const { Username, Email, phone, password, countryPin } = data

    const isUserExist = await userModel.findOne({
        where: { Email: Email }
    })

    if (isUserExist) {
        const err = new Error('Try logging in with this account')
        err.statusCode = 400
        err.error = 'User Already Exist!!'
        throw err
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await userModel.create({
        Username,
        Email,
        phone,
        password: hashedPassword,
        countryPin
    })

    const token = jwt.sign({ Username, Email, phone }, process.env.SECRET_KEY)
    const responseData = { Username, Email, phone }
    return { token, responseData }
}

const getUserLoggedIn = async (credentials) => {
    const { emailOrPhone, password } = credentials

    const isUserExist = typeof emailOrPhone === 'string' 
        ? await userModel.findOne({ where: { Email: emailOrPhone } }) 
        : await userModel.findOne({ where: { phone: emailOrPhone } })

    if (!isUserExist) {
        const err = new Error('Try creating an Account First or enter the correct password')
        err.statusCode = 400
        err.error = 'Email/phone or Password is wrong'
        throw err
    }

    const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password)
    if (!isPasswordCorrect) {
        const err = new Error('Try creating an Account First or enter the correct password')
        err.statusCode = 400
        err.error = 'Email/phone or Password is wrong'
        throw err
    }

    const token = jwt.sign(
        { Username: isUserExist.Username, Email: isUserExist.Email, phone: isUserExist.phone }, 
        process.env.SECRET_KEY
    )

    return token
}

module.exports = {
    signInUser,
    getUserLoggedIn
}