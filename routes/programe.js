var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Programe = require("../models/programe.js");

// simple route to render am HTML form that can POST data to our server
// NOTE that this is not a standard API route, and is really just for testing
router.get('/create-programe', function(req,res){
    res.render('programe-form.html')
  })

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


// /**
//  * POST '/api/create'
//  * Receives a POST request of the new programe, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Programe
//  * @return {Object} JSON
//  */

router.post('/create', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var prog_name = req.body.prog_name;
    var cust_name = req.body.cust_name;
    var redemption_no = req.body.redemption_no;
    var prod_item = req.body.prod_item;
    var consignment_no = req.body.consignment_no;
    var courier_type = req.body.courier_type;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var programeObj = {
        prog_name: prog_name,
        cust_name: cust_name,
        redemption_no: redemption_no,
        prod_item: prod_item,
        consignment_no: consignment_no,
        courier_type: courier_type,
    };

    // create a new animal model instance, passing in the object
    var programeObj = new Programe(programeObj);

    // now, save that programe instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    programe.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving programe'};
        return res.json(error);
      }

      console.log('saved a new programe!');
      console.log(data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        programe: data
      }

      return res.json(jsonData);
    //   return res.redirect('/show-pets')

    })
});


module.exports = router;