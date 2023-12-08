import dotenv from "dotenv"
import connectDB from "./db/index.js"
import express from "express"


dotenv.config({
    path: "./env"
})

connectDB()

    .then(() => {
        app.on("error", (err) => {
            console.log("Error: ", error);
            throw error;
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("Database connection Faild!!", err)
    })