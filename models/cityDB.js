var mongoose = require('mongoose');

let citySchema = mongoose.Schema({
    nom: String,
    url: String,
    temperature: String,
    temperatureMin: Number,
    temperatureMax:Number,
    position:Number,
    latitude: Number,
    longitude: Number
})
let cityModel = mongoose.model('cities',citySchema);


module.exports = cityModel;