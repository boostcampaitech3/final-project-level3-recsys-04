require('dotenv').config();

const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const cors = require('cors');

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const UserSchema = require("./lib/schema_user");
const RepoSchema = require("./lib/schema_repo");
const PopSchema = require("./lib/schema_pop");
const SimSchema = require("./lib/schema_sim");
const my_token = process.env.my_token;
mongoose.Promise = global.Promise; // Node 의 네이티브 Promise 사용
// mongodb 연결
const conn = mongoose.connect(process.env.MONGO_URI)
.then(
    (response) => {
        console.log('Successfully connected to mongodb');
    }
).catch(e => {
    console.error(e);
});

const app = express();

const options = { key: fs.readFileSync('rootca.key'), cert: fs.readFileSync('rootca.crt') };

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
app.use(cors());

var router = require('./router/main')(app, conn);
var init = require('./lib/init')(app, UserSchema, RepoSchema, mongoose, my_token);
var update = require('./lib/update')(app, UserSchema, RepoSchema, mongoose, my_token); 
var inference = require('./lib/inference')(app, UserSchema, RepoSchema, PopSchema, SimSchema, mongoose);
var coldstart = require('./lib/coldstart')(app, UserSchema, RepoSchema, PopSchema, mongoose);
var clicked = require('./lib/clicked')(app, UserSchema, RepoSchema, mongoose);