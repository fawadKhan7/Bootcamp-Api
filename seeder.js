const dotenv = require("dotenv")
const fs = require("fs")
const BootCamp = require("./models/bootcamp")
const mongoose = require("mongoose")

dotenv.config({ path: "./config/config.env" })

//CONNECT DB
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//READ JSON FILES
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

//IMPORT DATA
const importData = async () => {
    try {
        await BootCamp.create(bootcamps)
        console.log("Data Imported")
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

//DELETE DATA
const deleteData = async () => {
    try {
        await BootCamp.deleteMany()
        console.log("Data Destroyed")
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if (process.argv[2] === "-i") {
    importData()
} else if (process.argv[2] === "-d") {
    deleteData()
}