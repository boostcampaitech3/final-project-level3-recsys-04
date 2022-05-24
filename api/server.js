const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mysql      = require('mysql');
const dbconfig   = require('./authenticate.json');
const conn = mysql.createConnection(dbconfig);
const app = express();

const options = { key: fs.readFileSync('/opt/ml/rootca.key'), cert: fs.readFileSync('/opt/ml/rootca.crt') };

// Create an HTTP server. 
http.createServer(app).listen(3000, function(){
    console.log("Express server has started on port http://127.0.0.1:3000")
});
// Create an HTTPS server. 
https.createServer(options, app).listen(3001);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var router = require('./router/main')(app, conn);
var init = require('./lib/init')(app, conn);
var update = require('./lib/update')(app, conn);
var inference = require('./lib/inference')(app, conn);
// next cycle
// var coldstart = require('./lib/coldstart')(app, conn);
var clicked = require('./lib/clicked')(app, conn);