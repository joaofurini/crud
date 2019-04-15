const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Essa será a estrutura dos dados que receberemos

const DataSchema = new Schema(
    {
        id: Number,
        message: String

    },
    {timestamps: true}
)

module.exports = mongoose.model("Data", DataSchema)