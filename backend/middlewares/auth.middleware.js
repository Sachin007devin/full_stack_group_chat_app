const jwt = require('jsonwebtoken')
const { userModel } = require('../models')

const authenticate = async(req,res,next)=>{
try {
    
    const token = req.header('Authorization')

    const payload = jwt.verify(token,process.env.SECRET_KEY)

    const user = await userModel.findByPk(payload.id)
    req.user = {id:user.id,Username: user.Username, Email: user.Email, phone: user.phone}

    next()
} catch (error) {
  return res.status(401).json({ error: 'Invalid or expired token' });
}
}

module.exports = authenticate