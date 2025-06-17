import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv' 
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.route.js'
import travelStoryRoutes from './routes/travelStory.route.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

mongoose.connect('mongodb://localhost:27017/')
.then(() => {
    console.log('MongoDB connected Succesfully')
})
.catch((error) => {
    console.log('Failed to connect to mongoDB')
})



const app = express();
app.use(cookieParser());
//for allowing json
app.use(express.json());

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth' ,authRoutes)
app.use('/api/user' ,userRoutes)
app.use('/api/travel-story' ,travelStoryRoutes)

//serve static files from the uploads and assests directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/uploads' ,express.static(path.join(__dirname,"uploads")))
app.use('/assets' ,express.static(path.join(__dirname ,"assets")))

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