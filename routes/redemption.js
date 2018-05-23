var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require('xls-to-json-lc');
var xlsxtojson = require('xlsx-to-json-lc');
var async = require('async');

// our db model
var Redemption = require("../models/redemption.js");

router.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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

router.use(bodyParser.json());

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');


// simple route to render an HTML page that upload data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/upload-file', function (req, res) {
    res.render('upload.html')
})

router.get('/upload-done', function(req,res){
    res.render('upload-done.html')
  })


/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function (req, res) {

    var jsonData = {
        'name': 'Redemption',
        'api-status': 'OK'
    }

    // respond with json data
    res.json(jsonData)
});


// /**
//  * GET '/redemption/'
//  * Receives a GET request to get all redemption details
//  * @return {Object} JSON
//  */

router.get('/get/all', function (req, res) {

    //mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
    Redemption.find(function (err, data) {

        //if error or no redemption found, respond with error
        if (err || data == null) {
            var error = {
                status: 'ERROR',
                message: 'Could not find redemption'
            };
            return res.json(error);
        }

        //if redemption is true
        // var jsonData = {
        //   status: 'OK',
        //   redemption: data
        // }

        res.json(data);
    })
})


// /**
//  * POST '/redemption/create'
//  * Receives a POST request of the new redemption, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Redemption
//  * @return {Object} JSON
//  */

router.post('/create', function (req, res) {

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
    redemption.save(function (err, data) {
        // if err saving, respond back with error
        if (err) {
            var error = {
                status: 'ERROR',
                message: 'Error saving redemption'
            };
            return res.json(error);
        }

        console.log('saved a new redemption!');
        console.log(data);

        // now return the json data of the new redemption
        //   var jsonData = {
        //     status: 'OK',
        //     redemption: data
        //   }

        return res.json(data);

    })
});

// /**
//  * GET '/redemption/get/:id'
//  * Receives a GET request specifying the redemption to get
//  * @param  {String} req.params.id - The redemptionId
//  * @return {Object} JSON
//  */

router.get('/get/:id', function (req, res) {

    var requestedId = req.params.id;

    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
    Redemption.findById(requestedId, function (err, data) {

        // if err or no user found, respond with error
        if (err || data == null) {
            var error = {
                status: 'ERROR',
                message: 'Could not find that redemption'
            };
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

router.get('/delete/:id', function (req, res) {

    var requestedId = req.params.id;

    // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
    Redemption.findByIdAndRemove(requestedId, function (err, data) {
        if (err || data == null) {
            var error = {
                status: 'ERROR',
                message: 'Could not find that redemption to delete'
            };
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
router.post('/upload', function (req, res) {
    var exceltojson;
    upload(req, res, function (err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({
                error_code: 1,
                err_desc: "No file passed"
            });
            return;
        }
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        console.log(req.file.path);
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, function (err, result) {
                
                if (err) {
                    return res.json({
                        error_code: 1,
                        err_desc: err,
                        data: null
                    });
                }
                var length = result.length;
                console.log(length);
                var redemptionObj = {};

                async.map(result, function(result, key, callback){
                    //renaming the data respectively to the database
                    result["prog_name"] = result["program name"];
                    result["cust_name"] = result["custname"];
                    result["redemption_no"] = result["redemption no"];
                    result["prod_item"] = result["product / item"];
                    result["consignment_no"] = result["consignment no"];
                    result["courier_type"] = result["courier type"];
                    result["dateAdded"] = result["date"];
        
                    //delete the excel data name
                    delete result["program name"];
                    delete result["custname"];
                    delete result["redemption no"];
                    delete result["product / item"];
                    delete result["consignment no"];
                    delete result["courier type"];
                    delete result["date"];
                    delete result["no"];
        
                    // push the result into object
                    var prog_name = result["prog_name"];
                    var cust_name = result["cust_name"];
                    var redemption_no = result["redemption_no"];
                    var prod_item = result["prod_item"];
                    var consignment_no = result["consignment_no"];
                    var courier_type = result["courier_type"];
                    var dateAdded = result["dateAdded"];
                    
                
                    // hold all this data in an object
                    // this object should be structured the same way as your db model
                    redemptionObj = {
                        prog_name: prog_name,
                        cust_name: cust_name,
                        redemption_no: redemption_no,
                        prod_item: prod_item,
                        consignment_no: consignment_no,
                        courier_type: courier_type,
                        dateAdded: dateAdded
                    };
                })
        
                // // create a new redemption model instance, passing in the object
                // var redemption = new Redemption(redemptionObj);
        
                // // now, save that redemption instance to the database
                // redemption.save(function (err, result) {
                //     // if err saving, respond back with error
                //     if (err) {
                //         var error = {
                //             status: 'ERROR',
                //             message: 'Error saving redemption'
                //         };
                //         return res.json(error);
                //     }
        
                //     console.log(result);
        
                //     // now return the json data of the new redemption
                //     return res.json(result);
        
                // })
            
                // // res.json(result);

                res.json(result);
                //  res.redirect('/redemption/upload-done')
                // res.jsonData(result);
            });
        } catch (e) {
            res.json({
                error_code: 1,
                err_desc: "Corupted excel file"
            });
        }
    })


});

router.post('/upload/create', function (req, res) {

    console.log(req.body);

    // pull out the information from the req.body
    var prog_name = req.body.prog_name;
    var cust_name = req.body.cust_name;
    var redemption_no = req.body.redemption_no;
    var prod_item = req.body.prod_item;
    var consignment_no = req.body.consignment_no;
    var courier_type = req.body.courier_type;
    var dateAdded = req.body.dateAdded;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var redemptionObj = {
        prog_name: prog_name,
        cust_name: cust_name,
        redemption_no: redemption_no,
        prod_item: prod_item,
        consignment_no: consignment_no,
        courier_type: courier_type,
        dateAdded: dateAdded
    };

    // create a new redemption model instance, passing in the object
    var redemption = new Redemption(redemptionObj);


    redemption.create(function (err, data) {
        if (err){ 
            return console.error(err);
        }        
        return res.json(data);

    });
    // now, save that redemption instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    // redemption.save(function (err, data) {
    //     // if err saving, respond back with error
    //     if (err) {
    //         var error = {
    //             status: 'ERROR',
    //             message: 'Error saving redemption'
    //         };
    //         return res.json(error);
    //     }

    //     console.log('saved a new redemption!');

    //     return res.json(data);

    // })
});

module.exports = router;