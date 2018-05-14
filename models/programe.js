var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var programeScheme = new Schema({
    prog_name: String,
    // name: {type: String, required: true}, // this version requires this field to exist
	// name: {type: String, unique: true}, // this version requires this field to be unique in the db
    cust_name: String,
    dateAdded : { 
        type: Date, 
        default: Date.now 
    },
    redemption_no: String,
    product: String,
    consignment_no: String,
    courier_type: String
})

// export 'Programe' model so we can interact with it in other files
module.exports = mongoose.model('Programe', programeScheme);