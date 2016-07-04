//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');

var express = require('express');

//DB init (NeDB)
var placeseventsDatabaseUrl = "data/placesevents.db"; // "username:password@example.com/mydb"
var organizersDatabaseUrl = "data/organizers.db";
var Datastore = require('nedb');
var db = {};
db.events = new Datastore({ filename: placeseventsDatabaseUrl, autoload: true });
db.organizers = new Datastore({ filename: organizersDatabaseUrl, autoload: true });


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();
var server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/
app.use(cors());

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

//Routes
var events = require('./routes/events');
app.use('/', events)


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Swingnow server listening at", addr.address + ":" + addr.port);
});

module.exports = app;