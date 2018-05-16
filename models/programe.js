var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var programeSchema = new Schema({
	id: {
		type: String,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	prog_name: String,
	cust_name: String,
	date: { 
		type: Date, 
		default: Date.now 
	},
	redemption_no: String,
	prod_item: String,
	consignment_no: String,
	courier_type: String,
		
})

// export 'Programe' model so we can interact with it in other files
module.exports = mongoose.model('Programe',programeSchema);

