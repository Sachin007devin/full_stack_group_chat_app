const userModel = require('./user.model')
const messageModel = require('./message.model')

userModel.hasMany(messageModel,{ foreignKey:'senderId' , as:'sentMessages'})
messageModel.belongsTo(userModel,  { foreignKey:'senderId' , as:'sender'})

userModel.hasMany(messageModel,{ foreignKey:'receiverId' , as:'receivedMessage'})
messageModel.belongsTo(userModel,{ foreignKey:'receiverId' , as:'receiver'})

module.exports = {userModel,messageModel}