var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var redemptionSchema = new Schema({
	prog_name: String,
	cust_name: String,	
	redemption_no: String,
	prod_item: String,
	consignment_no: String,
	courier_type: String,
	dateAdded: String	
})

// export 'Redemption' model so we can interact with it in other files
module.exports = mongoose.model('Redemption',redemptionSchema);

