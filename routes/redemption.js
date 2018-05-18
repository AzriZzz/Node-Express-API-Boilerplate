var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
    
// our db model
var Redemption = require("../models/redemption.js");

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


/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  var jsonData = {
  	'name': 'Redemption',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});


// /**
//  * GET '/redemption/'
//  * Receives a GET request to get all redemption details
//  * @return {Object} JSON
//  */

router.get('/get/all', function(req, res) {

  //mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Redemption.find(function(err, data){

    //if error or no redemption found, respond with error
    if (err || data == null){
      var error = {
        status: 'ERROR', 
        message: 'Could not find redemption'
      };
        return res.json(error);
    }

    //if redemption is true
    var jsonData = {
      status: 'OK',
      redemption: data
    }

    res.json(jsonData);
  })
})


// /**
//  * POST '/redemption/create'
//  * Receives a POST request of the new redemption, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Redemption
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
    var no = req.body.no;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var redemptionObj = {
        prog_name: prog_name,
        cust_name: cust_name,
        redemption_no: redemption_no,
        prod_item: prod_item,
        consignment_no: consignment_no,
        courier_type: courier_type,
        no: no
    };

    // create a new redemption model instance, passing in the object
    var redemption = new Redemption(redemptionObj);

    // now, save that redemption instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    redemption.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving redemption'};
        return res.json(error);
      }

      console.log('saved a new redemption!');
      console.log(data);

      // now return the json data of the new redemption
      var jsonData = {
        status: 'OK',
        redemption: data
      }

      return res.json(jsonData);

    })
});

// /**
//  * GET '/redemption/get/:id'
//  * Receives a GET request specifying the redemption to get
//  * @param  {String} req.params.id - The redemptionId
//  * @return {Object} JSON
//  */

router.get('/get/:id', function(req, res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Redemption.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that redemption'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the program
    var jsonData = {
      status: 'OK',
      redemption: data
    }
    return res.json(jsonData);

  })
})

/**
 * GET '/redemption/delete/:id'
 * Receives a GET request specifying the redemption to delete
 * @param  {String} req.params.id - The redemption
 * @return {Object} JSON
 */

router.get('/delete/:id', function(req, res){

  var requestedId = req.params.id;

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Redemption.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that redemption to delete'};
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
 * POST '/redemption/upload'
 * Receives a POST request to excel file
 * @param  {String} req.params.id - The redemption
 * @return {Object} JSON
 */
 /** API path that will upload the files */
router.post('/upload', function(req, res) {
var exceltojson;
upload(req,res,function(err){
    if(err){
          res.json({
                error_code:1,
                err_desc:err
            });
          return;
    }
    /** Multer gives us file info in req.file object */
    if(!req.file){
        res.json({
            error_code:1,
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
    console.log(req.file.path);
    try {   
        exceltojson({
            input: req.file.path,
            output: null, //since we don't need output.json
            lowerCaseHeaders:true
        }, function(err,result){
            if(err) {
                return res.json({
                    error_code:1,
                    err_desc:err, 
                    data: null
                });
            } 
            res.json({
                error_code:0,
                err_desc:null, 
                data: result
            });
        });
    } catch (e){
        res.json({
            error_code:1,
            err_desc:"Corupted excel file"
        });
    }
})

});

module.exports = router;

