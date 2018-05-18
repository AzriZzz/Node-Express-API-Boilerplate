var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Programe = require("../models/programe.js");

// Add headers
router.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  var jsonData = {
  	'name': 'Programe',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// /**
//  * POST '/programe/create'
//  * Receives a POST request of the new animal, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/create', function(req, res){

  console.log(req.body);

  // pull out the information from the req.body
  var prog_name = req.body.prog_name;

  // hold all this data in an object
  // this object should be structured the same way as your db model
  var programObj = {
    prog_name: prog_name,
  };

  // create a new animal model instance, passing in the object
  var programe = new Programe(programObj);

  // now, save that animal instance to the database
  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
  programe.save(function(err,data){
    // if err saving, respond back with error
    if (err){
      var error = {status:'ERROR', message: 'Error saving programe'};
      return res.json(error);
    }

    console.log('saved a new programe!');

    // now return the json data of the new animal
    var jsonData = {
      status: 'OK',
      programe: data
    }

    return res.json(jsonData);

  })
});

// /**
//  * GET '/programe/get'
//  * Receives a GET request to get all programe 
//  * @return {Object} JSON
//  */

router.get('/get/all', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Programe.find(function(err, data){
    // if err or no animals found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find programe'};
      return res.json(error);
    }

    // // otherwise, respond with the data
    // var jsonData = {
    //   status: 'OK',
    //   programe: data
    // }

    // console.log(jsonData);
    res.json(data);

  })
})


module.exports = router;

