
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors({
    origin:[process.env.ALLOWED_DOMAIN],
    credentials:true
}))

app.use(express.json())

app.use((err,req,res,next)=>{
    res.status(500).json({
        message:'Some Internal error occured!!',
        err
    })
})

const db = require('./service/db.connection')

//models
require('./models/user.model')

//routes
const userRoutes = require('./routes/user.routes')

app.use('/user',userRoutes)

db.sync({alter:true}).then(()=>{
    app.listen(process.env.PORT,()=>console.log('server running on port',process.env.PORT)) 
}).catch(error=>{throw error})
