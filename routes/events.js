var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID

/**
 * 
 * GET
 * /place
 * /pace/:uid/event
 * 
 * 
 * POST
 * /place
 * /place/:uid/event
 * 





/* GET home page. */
router.get('/', function(req, res) {
    //res.render('index', { title: 'Express' });
    res.end("GET /: OK");
});

/* GET places with events */
router.get('/place', function(req, res) {
    var db = req.db;
    //MONGODB: var collection = db.get('usercollection');
	var collection = db.events;
    collection.find({},{},function(err,docs){
		if( err || !docs) {
			console.log("No users found");
		} 
		else {
		    console.log(docs);
		    var response = "{ events"
			//res.writeHead(200, {'Content-Type': 'application/json'});
			//res.end(docs);
			res.json({ places: docs });
		}
    });
});


/* @deprecated GET events list. */
router.get('/event', function(req, res) {
    var db = req.db;
    //MONGODB: var collection = db.get('usercollection');
	var collection = db.events;
    collection.find({},{},function(err,docs){
		if( err || !docs) {
			console.log("No users found");
		} 
		else {
		    console.log(docs);
		    var response = "{ events"
			//res.writeHead(200, {'Content-Type': 'application/json'});
			//res.end(docs);
			res.json({ events: docs });
		}
    });
});



/* POST to Add a Place with an Event */
router.post('/place', function(req, res) {
	
		// Set our internal DB variable
    	var db = req.db;
		//MONGODB: var collection = db.get('usercollection');
		var collection = db.events;
		var organizerCollection = db.organizers;
	
		var organizerID = req.body.organizerID;
		//If organizer does not exist
		if(!organizerID){
			//Insert
		    organizerCollection.insert({
		    	  "organizerName" : req.body.organizer,
		    	  "organizerFb": req.body.organizerFb,
		    	  "organizerWeb": req.body.organizerWebsite,
		    	  "organizerEmail": req.body.organizerEmail,
		    	  "organizerPhone": req.body.organizerPhone,
		    	  "organizerCountry": req.body.organizerCountry,
				  "organizerCountryCode": req.body.countryCode,
				  "organizerCity": req.body.organizerCity,
		    }, function (err, doc) {
		        if (err) {

		        }
		        else {
		            organizerID = doc._id;
		            addPlaceAndEvent(db, req, res, organizerID);
		        }
		    });
		} 
		else {
			addPlaceAndEvent(db, req, res, organizerID);
		}
});

function insertOrganizer(db, req, res, callback){
	//TODO
}

/**
 * Insert a new place with events.
 * 
 */ 
function addPlaceAndEvent(db, req, res, organizerID){
	
		//MONGODB: var collection = db.get('usercollection');
		var collection = db.events;

		// Submit to the DB
		collection.insert({
			  "placeName" : req.body.placeName,
			  "address": req.body.address,
			  "country": req.body.country,
			  "countryCode": req.body.countryCode,
			  "city": req.body.city,
			  "lat": req.body.lat,
			  "lon": req.body.lon,
			  "events" : [
			  		{
			  			  "_id" : new ObjectID().toHexString(),
			  			  "title": req.body.title,
						  
						  "beginDate": req.body.beginDate,
						  "endDate": req.body.endDate,
						  "beginHour": req.body.beginHour,
						  "endHour": req.body.endHour,
						  "wholeDay" : req.body.wholeDay,
						  "repeat" : req.body.repeat,
						  "price" : req.body.price,
						  "organizer": organizerID,
						  
						  "email": req.body.organizerEmail,
						  "web": req.body.web,
						  "fb": req.body.fb,
						  "phone": req.body.organizerPhone,
						  "eventType": req.body.eventType,
						  "styles": req.body.styles,
						  "description": req.body.description
			  		}
			  	]
			  
			  
		}, function (err, doc) {
		    if (err) {
		        // If it failed, return error
		        res.send("There was a problem adding the information to the database.");
		    }
		    else {
		        //res.writeHead(200, {'Content-Type': 'application/json'});
				//res.end(doc);
				res.json({ places : doc });
		    }
		});
	
}


/* POST to Add Event */
router.post('/place/:uid/event', function(req, res) {
		// Set our internal DB variable
		var db = req.db;
		//MONGODB: var collection = db.get('usercollection');
		var collection = db.events;
		var organizerCollection = db.organizers;
	
		var organizerID = req.body.organizerID;
		//If organizer does not exist
		if(!organizerID){
			//Insert
		    organizerCollection.insert({
		    	  "organizerName" : req.body.organizerName,
		    	  "organizerFb": req.body.organizerFb,
		    	  "organizerWeb": req.body.organizerWeb,
		    	  "organizerEmail": req.body.organizerEmail,
		    	  "organizerPhone": req.body.organizerPhone,
		    	  "organizerCountry": req.body.organizerCountry,
				  "organizerCountryCode": req.body.organizerCountryCode,
				  "organizerCity": req.body.organizerCity,
		    }, function (err, doc) {
		        if (err) {

		        }
		        else {
		            organizerID = doc._id;
		            updateEvent(db, req, res, organizerID);
		        }
		    });
		} 
		else {
			updateEvent(db, req, res, organizerID);
		}
});

function addEventToPlace(db, req, res, organizerID){
	
	db.update({ _id: req.params.uid },
		{ $push: 
			{
				  "_id" : new ObjectID().toHexString(),
	  			  "title": req.body.title,
				  
				  "beginDate": req.body.beginDate,
				  "endDate": req.body.endDate,
				  "beginHour": req.body.beginHour,
				  "endHour": req.body.endHour,
				  "wholeDay" : req.body.wholeDay,
				  "repeat" : req.body.repeat,
				  "price" : req.body.price,
				  "organizer": req.body.organizerID,
				  "email": req.body.email,
				  "web": req.body.web,
				  "fb": req.body.fb,
				  "phone": req.body.phone,
				  "eventType": req.body.eventType,
				  "styles": req.body.styles,
				  "description": req.body.description
	  		}
		},
		//{},
		function (err, doc) {
		    if (err) {
		        // If it failed, return error
		        res.send("/place/:uid/events --> There was a problem adding the information to the database.");
		    }
		    else {
		    	//TODO: Organizer in separate collection
				res.json({ places : doc });
		    }
		}
	);
	
}

/* POST to Add Event Service */
router.post('/events', function(req, res) {
    console.log("POST / :"+req.body);
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var title = req.body.title;
	console.log("Inserting: "+title);


    //MONGODB: var collection = db.get('usercollection');
	var collection = db.events;



    // Submit to the DB
    collection.insert({
    	  "name" : req.body.place,
    	  "address": req.body.address,
    	  "country": req.body.country,
		  "countryCode": req.body.country_code,
		  "city": req.body.city,

		  "title": title,
		  "lat": req.body.lat,
		  "lon": req.body.lon,
		  "beginDate": req.body.beginDate,
		  "endDate": req.body.endDate,
		  "beginHour": req.body.beginHour,
		  "endHour": req.body.endHour,
		  "wholeDay" : req.body.wholeDay,
		  "repeat" : req.body.repeat,
		  
		  
		  "organizer": req.body.organizer,
		  "email": req.body.email,
		  "web": req.body.web,
		  "phone": req.body.phone,
		  "eventType": req.body.eventType,
		  "styles": req.body.styles,
		  "description": req.body.description
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            //res.writeHead(200, {'Content-Type': 'application/json'});
			//res.end(doc);
			res.json({ events: doc });
        }
    });
});

module.exports = router;