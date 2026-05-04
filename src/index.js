// require('dotenv').config({})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`App listning on port ${process.env.PORT}`)
        })
        app.on("error", (error) => {
            console.log(`ERRR ${error}`)
            throw error
        })
    })
    .catch((error) => {
        console.log(`MongoDB Connection failed !! `, error)

    })






/*
import express from 'express'
const app = express()
(async ()=> {
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error) => {
        console.log(
            "application not running"
        )
        throw error
       })

       app.listen(process.env.PORT, () => {
        console.log(`app listening on port ${process.env.PORT}`)
       })
    }
    catch(err) {
        console.log(err)
        throw err

    }

})()
    */