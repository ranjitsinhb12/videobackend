import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// will receive jason data setting 
app.use(express.json({ limit: "12kb" }))
// url data receive setting
app.use(express.urlencoded({ extended: true, limit: "12kb" }))
// file folder store setting  This is a public folder
app.use(express.static("public"))
// Access and accept cookies 
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)

export { app }