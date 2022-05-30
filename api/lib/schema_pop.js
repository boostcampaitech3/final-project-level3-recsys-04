const mongoose = require("mongoose");
mongoose.pluralize(null);

const RepoSchema = new mongoose.Schema({
	"all": Array,
	"catM1": Array,
	"catM2": Array,
	"catM3": Array,
	"catM4": Array,
	"catM5": Array,
	"catM6": Array
})

module.exports = mongoose.model('popularity', RepoSchema)