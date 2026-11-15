const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME,'root',process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    dialect:'mysql'
})

;(async ()=>{
    try {
        await sequelize.authenticate()
        console.log('connection established successfully')
    } catch (error) {
        throw error
    }
})()

module.exports = sequelize