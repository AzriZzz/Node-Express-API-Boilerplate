var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Programe = require("../models/programe.js");

/**
 * GET '/programe'
 * Programe home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

    var jsonData = {
        'name': 'Program',
        'api-status':'OK'
    }
  
    // respond with json data
    res.json(jsonData)
  });

// /**
//  * GET '/programe/listall'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/listall', function(req, res) {

  //mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Programe.find({},function(err, data){

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
    console.log(jsonData);
    res.json(jsonData);
  })
})


module.exports = router;