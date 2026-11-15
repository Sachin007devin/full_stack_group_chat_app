const sequelize = require('../service/db.connection')
const { DataTypes } = require('sequelize')

const userModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unqiue: true
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unqiue:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryPin:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = userModel