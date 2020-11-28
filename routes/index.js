

var express = require('express');
var router = express.Router();
var request = require('sync-request');
require('dotenv').config();

//Require la bdd
var cityModel = require('../models/cityDB');
var userModel= require('../models/userDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/weather', async function(req, res, next) {
  if(req.session.user == null){
    res.redirect('/')
  } 
  else {
  var dataCity = await cityModel.find();
  res.render('weather', { dataCity });
  }
});


router.post('/add-city', async function(req,res){
  
  var resultAPI = request("GET", "https://api.openweathermap.org/data/2.5/weather?appid="+ process.env.APIweather +"&units=metric&lang=fr&q=" + req.body.nom);
  var dataCity = await cityModel.find();

  if(resultAPI.statusCode === 200) {
    let result = JSON.parse(resultAPI.getBody());
    console.log(result);
  
    var searchUser = await cityModel.findOne({
      nom: req.body.nom.toLowerCase()
    });
  
    
  
    var iconcode = result.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png"
    
    if(searchUser== null && result.name){
        
        var newCity = new cityModel({
        nom: req.body.nom.toLowerCase(),
        url: iconurl,
        temperature: result.weather[0].description,
        temperatureMin:result.main.temp_min,
        temperatureMax:result.main.temp_max,
        latitude: result.coord.lat,
        longitude: result.coord.lon
        
        });
        await newCity.save();
      dataCity = await cityModel.find();
    }
   
    
  }
  
  
  res.render('weather',{ dataCity })
});


router.get('/trash', async function(req, res, next) {
  
  await cityModel.deleteOne(
    {_id: req.query.id }
    
  );

  dataCity = await cityModel.find();

  res.render('weather', { dataCity });
});

router.get('/update', async function(req,res,nex){
  var dataCity = await cityModel.find();

  
  for (let i= 0; i< dataCity.length; i++){

    var resultAPI = request("GET", "https://api.openweathermap.org/data/2.5/weather?appid="+ process.env.APIweather +"&units=metric&lang=fr&q="+ dataCity[i].nom);
    let result = JSON.parse(resultAPI.getBody());

    var iconcode = result.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png"

    await cityModel.updateOne(
    { _id: req.query.id }, 
    {  
      url: iconurl,
      temperature: result.weather[0].description,
      temperatureMin:result.main.temp_min,
      temperatureMax:result.main.temp_max});
  }
  dataCity = await cityModel.find();
  res.render('weather', {dataCity})
});

router.post('/sign-up', async function(req, res, next){

  
  
  var searchUser = await userModel.findOne({
    email: req.body.email,
  });
  // var dataUser = await userModel.find();
    if(!searchUser) {
      var newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
    
      var newUserSave = await newUser.save();
      req.session.user = {
        name: newUserSave.username,
        id: newUserSave._id,
      }
      res.redirect('/weather')
      
    }  
    else{
       res.redirect('/')
    }
   

});

router.post('/sign-in', async function(req, res, next){

  var searchUser = await userModel.findOne({
    email: req.body.email,
    password: req.body.password
  })
  if(searchUser!= null){
    req.session.user = {
      name: searchUser.username,
      id: searchUser._id
    }
    res.redirect('/weather')
  } 
  else {
    res.redirect('/')
  }
  
});


router.get('/sign-out',function(req,res, next ){
  req.session.user = null;
  res.redirect('/')
})
module.exports = router;
