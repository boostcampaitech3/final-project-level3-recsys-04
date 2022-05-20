var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const fetch = require("node-fetch");

var express = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./authenticate.json');
const conn = mysql.createConnection(dbconfig);
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var router = require('./router/main')(app, conn);
var init = require('./lib/init')(app, conn);
var update = require('./lib/update')(app, conn);
var inference = require('./lib/inference')(app, conn);
// next cycle
// var coldstart = require('./lib/coldstart')(app, conn);
var clicked = require('./lib/clicked')(app, conn);

var server = app.listen(3000, function(){
    console.log("Express server has started on port http://127.0.0.1:3000")
});
