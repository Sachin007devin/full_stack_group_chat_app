const express = require('express')

const router = express.Router()

const messageController = require('../controllers/message.controller')
const authenticate = require('../middlewares/auth.middleware')

router.post('/send/:receiverId' ,authenticate, messageController.sendMessage)

router.get('/:receiverId', authenticate ,messageController.getMessages)

module.exports = router