var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
    
// our db model
var Programe = require("../models/programe.js");


router.use(bodyParser.json());  

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');


// simple route to render an HTML page that upload data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/upload-file', function(req,res){
  res.render('upload.html')
})


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

    // otherwise respond with JSON data of the program
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

/**
 * POST '/programe/upload'
 * Receives a POST request to excel file
 * @param  {String} req.params.id - The programe
 * @return {Object} JSON
 */
/** API path that will upload the files */
router.post('/upload', function(req, res) {
  var exceltojson;
  upload(req,res,function(err){
      if(err){
           res.json({
             error_code:11,
             err_desc:err
            });
           return;
      }
      /** Multer gives us file info in req.file object */
      if(!req.file){
          res.json({
            error_code:12,
            err_desc:"No file passed"
          });
          return;
      }
      /** Check the extension of the incoming file and 
       *  use the appropriate module
       */
      if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
          exceltojson = xlsxtojson;
      } else {
          exceltojson = xlstojson;
      }

      //ini yang keluarkan kat depan
      console.log(req.file.path);
      

      try {
          exceltojson({
              input: req.file.path,
              output: null, //since we don't need output.json
              lowerCaseHeaders:true
          }, function(err,data){
              if(err) {
                  return res.json({
                    error_code: 13,
                    err_desc: err, 
                    programe: null
                  });
              } 
              res.json({
                error_code: 0,
                err_desc: null, 
                programe: data
              });
          });
      } catch (e){
          res.json({
            error_code:14,
            err_desc:"Corupted excel file"
          });
      }
  }) 
});

module.exports = router;

