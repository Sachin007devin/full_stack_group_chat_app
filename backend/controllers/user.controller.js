const { errorResponse, sendResponse } = require('../utils/responseHandlers')
const { signInUser, getUserLoggedIn } = require('../utils/usermodel.utils')

async function registerUser(req, res) {
    try {
        const { Username, Email, phone, password, countryPin } = req.body

        if (!Username || !Email || !phone || !password || !countryPin) {
            return errorResponse(res, {
                statusCode: 400,
                message: 'Please fill all the fields',
                error: 'All fields are required!!'
            })
        }

        const { token, responseData } = await signInUser({ Username, Email, phone, password, countryPin })

        return sendResponse(res, {
            statusCode: 201,
            message: 'User registered successfully',
            data: responseData,
            token
        })
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.statusCode || 500,
            message: error.message || 'Some Internal error occurred!!',
            error: error.error || error.message
        })
    }
}

async function loginUser(req, res) {
    try {
        const { emailOrPhone, password } = req.body
        if (!emailOrPhone || !password) {
            return errorResponse(res, {
                statusCode: 400,
                message: 'Please fill all the fields',
                error: 'All fields are required!!'
            })
        }

        const token = await getUserLoggedIn({ emailOrPhone, password })

        return sendResponse(res, {
            statusCode: 200,
            message: 'User logged in successfully',
            token
        })
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.statusCode || 500,
            message: error.message || 'Some Internal error occurred!!',
            error: error.error || error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser
}