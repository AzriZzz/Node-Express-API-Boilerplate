var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Programe = require("../models/programe.js");

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

module.exports = router;