var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder'); // geocoder library

// our db model
var Programe = require("../models/programe.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/programe', function(req, res) {

    var jsonData = {
        'name': 'Programme',
        'api-status':'OK'
    }
  
    // respond with json data
    res.json(jsonData)
});

