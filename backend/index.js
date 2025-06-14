import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv' 
import authRoutes from './routes/auth.route.js'

dotenv.config()

mongoose.connect('mongodb://localhost:27017/')
.then(() => {
    console.log('MongoDB connected Succesfully')
})
.catch((error) => {
    console.log('Failed to connect to mongoDB')
})



const app = express();

//for allowing json
app.use(express.json());

// app.use(cors())

app.use('/api/auth' ,authRoutes)

app.listen(3000 ,() => {
    console.log('App is listening on port 3000');
}) 

app.use((err ,req ,res ,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})