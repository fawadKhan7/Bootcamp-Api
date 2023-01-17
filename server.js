const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const connectdb = require("./config/db")
const errorhandler = require("./middleware/error")
//routes files
const bootcamp = require("./routes/bootcamps")

//load env var
dotenv.config({ path: "./config/config.env" })

connectdb()
const app = express()

app.use(express.json())
//mount route
app.use("/api/v1/bootcamps", bootcamp)
app.use(errorhandler)

app.use(morgan("combined"))


const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`RUNNING on port ${PORT} on ${process.env.NODE_ENV} mode`.bgYellow.bold)
})

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error:${err.message}`)
    server.close(() => { process.exit(1) })
})