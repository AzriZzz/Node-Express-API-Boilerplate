var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var programeSchema = new Schema({
	prog_name: String
})

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Programe',programeSchema);
