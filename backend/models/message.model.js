 const sequelize = require('../service/db.connection')
 const {DataTypes} = require('sequelize')

 const messageModel = sequelize.define('Message',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    senderId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    receiverId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    content:{
        type:DataTypes.STRING,
        allowNull:true
    },
    messageType:{
        type:DataTypes.ENUM('text','audio','photo'),
        defaultValue:'text'
    },
    mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
 },{
    timestamps:true,
    indexes:[
        { fields: ['senderId', 'receiverId', 'createdAt'] }
    ]
 })
 
 module.exports = messageModel