const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
const connectdb = async () => {
    const conn = mongoose.connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: false,

    })
    console.log(`MongoDb connected `)
}

module.exports = connectdb