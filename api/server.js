var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var app = express();
var router = require('./router/main')(app);

var init = require('./lib/init')(app);
var fetch = require('./lib/fetch')(app);
var update = require('./lib/update')(app);
var inference = require('./lib/inference')(app);
var coldstart = require('./lib/coldstart')(app);
var clicked = require('./lib/clicked')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
    console.log("Express server has started on port http://127.0.0.1:3000")
});
