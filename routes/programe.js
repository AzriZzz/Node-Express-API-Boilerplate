var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Programe = require("../models/programe.js");

// /**
//  * GET '/programe/'
//  * Receives a GET request to get all programe details
//  * @return {Object} JSON
//  */

router.get('/', function(req, res) {

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
//  * POST '/programe/create'
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

    // create a new programe model instance, passing in the object
    var programe = new Programe(programeObj);

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

      // now return the json data of the new programe
      var jsonData = {
        status: 'OK',
        programe: data
      }

      return res.json(jsonData);

    })
});

// /**
//  * GET '/programe/get/:id'
//  * Receives a GET request specifying the programe to get
//  * @param  {String} req.params.id - The programeId
//  * @return {Object} JSON
//  */

router.get('/get/:id', function(req, res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Programe.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that programe'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the programe
    var jsonData = {
      status: 'OK',
      programe: data
    }
    return res.json(jsonData);

  })
})

/**
 * GET '/programe/delete/:id'
 * Receives a GET request specifying the programe to delete
 * @param  {String} req.params.id - The programe
 * @return {Object} JSON
 */

router.get('/delete/:id', function(req, res){

  var requestedId = req.params.id;

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Programe.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that programe to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})




module.exports = router;