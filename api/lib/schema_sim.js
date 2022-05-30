const mongoose = require("mongoose");
mongoose.pluralize(null);

const SimSchema = new mongoose.Schema({
	"rid": Number,
	"graph_sim": Array,
	"doc2vec": Array,
	"code2vec": Array
})

module.exports = mongoose.model('similarity', SimSchema)