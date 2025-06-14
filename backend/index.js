import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv' 

dotenv.config()

mongoose.connect('mongodb://localhost:27017/')
.then(() => {
    console.log('MongoDB connected Succesfully')
})
.catch((error) => {
    console.log('Failed to connect to mongoDB')
})



const app = express();
// app.use(cors())

app.listen(3000 ,() => {
    console.log('App is listening on port 3000');
}) 