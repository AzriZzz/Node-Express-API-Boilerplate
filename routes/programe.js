var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Programe = require('../models/programe.js');

/**
 * GET '/programe'
 * Just relays a success message back.
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
//  * GET '/programe/get-all'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/get-all', function(req, res) {

  //mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Programe.find(function(err, data){

    //if error or no programe found, respond with error
    if (err || data == null){
      var error = {
        status: 'ERROR', 
        message: 'Could not find programe'};
        return res.json(error);
    }

    //if programe is true
    var jsonData = {
      status: 'OK',
      programe: data
    }
    res.json(jsonData);
  })
})

// /**
//  * GET '/programe/search/id'
//  * Receives a GET request to search a programe
//  * @return {Object} JSON
//  */
router.get('/search/id', function(req, res){
  var searchTerm = req.query.name;
  console.log("Searching for a " + searchTerm);

  //Finding the programe from the input
  Programe.find({ name: searchTerm }, function(err, data){

    //if err, respond with an error
    if(err){
      var error = {
        status: 'ERROR',
        message: 'Something went wrong'
      }
      return res.json(error);
    }

    //if no programe, respond with no programe 
    if(data==null || data.length==0){
      var message = {
        status: 'NO RESULTS',
        message: 'We couldn\'t find any results'
      }
      return res.json(message);
    }

    //otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      programe: data
    }
    res.json(jsonData);
  })
})

module.exports = router;
