const mongoose = require("mongoose");
mongoose.pluralize(null);

const RepoSchema = new mongoose.Schema({
	"rid": Number,
	"uid": Number,
	"login": String,
	"repo_name": String,
	"stars": Number,
	"star_pages": Number,
	"topics": Array,
	"languages": Object,
	"category": {
								"category_L": String,
								"category_M": String,
								"category_S": String
							},
	"updated_at": Date,
	"star_user_list": Array
})

module.exports = mongoose.model('repository', RepoSchema)