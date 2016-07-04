/*** MATERIALIZE CONFIGURATION ***/
$('select').material_select();
/*** end MATERIALIZE CONFIGURATION ***/

/*** EVENTS ***/
$('#closeRightPanel').click(function(){
  $('#rightPanel').addClass('hide');
});
/*** LANDING ***/
$('.landing-content a').click(function(){
  $('.landing-background').addClass('hide');
  $('.navbars').removeClass('hide');  
})
/*** end LANDING ***/

/*** MAP CONFIGURATION ***/
var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  osmAttrib = '&copy; ' + osmLink + ' Contributors';

var osmMap = L.tileLayer(osmUrl, {
  attribution: osmAttrib
});

//GLOBAL VARIABLE
/*map = L.map('map', {
    layers: [osmMap] // only add one!
  })
  .setView([42.865439, -2.700480], 3);
;
*/
map = new L.Map('map', {center: new L.LatLng(42.865439, -2.700480), zoom: 3,zoomControl:false});
var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
var ggl = new L.Google();
var ggl2 = new L.Google('TERRAIN');
map.addLayer(ggl2);



var apiKey = 'search-NdWqgQU';

var options = {
  bounds: true,
  position: 'topright',
  expanded: true
}

var geocoder = L.control.geocoder(apiKey,options).addTo(map);
geocoder.on('select', function (e) {
  console.log('You’ve selected', e);
  console.log('Latlng info:', e.latlng);
  console.log('Feature info:', e.feature);
});

/*** end MAP CONFIGURATION ***/

/*** FACEBOOK LONG TERM TOKEN ***/
/*
var url = "/oauth/access_token?  "+
    "grant_type=fb_exchange_token&amp;  "+         
    "client_id=243757625994775&amp; "+
    "client_secret=33ef753d4cd63f7300e1d8f883a895b1&amp; "+
    "fb_exchange_token=243757625994775|zM9DVpKqCp3AXElytvAgefxyozk";
    
    
$.get( "ajax/test.html", function( data ) {
  $( ".result" ).html( data );
  alert( "Load was performed." );
});*/

/*** end FACEBOOK LONG TERM TOKEN ***/

//Modal inizializations:
// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
$('.modal-trigger').leanModal({
  dismissible: true, //do not close if clicks outside
  ready: function() {
    
    resetSubmitEventModal();
    $('#location-picker-map').locationpicker('autosize'); //Hack for geocoder map loading properly.
  }
});

/*
$('#contact-modal-link').click(function(){
  $('#contact-modal').toggleClass('displayed');
});
*/
/******** MENU INIZIALIZATIONS: ****************/
$(".button-collapse").sideNav(); //For mobile compatibility
//We need to close manually the mobile menu when a link is pressed and a modal is fired:
$('#mobile-demo a').click(function(){
  //First close all modals if we have previously opened any:
  //TODO: NOT WORKING, DOESNT LET THE NEW MODAL OPEN.
  //$('.modal').closeModal();
  $('.button-collapse').sideNav('hide');
});
/******** .end: MENU INIZIALIZATIONS: **********/

/******** FORM INIZIALIZATIONS: ****************/

/* Validator */
// Extension pour comptabilité avec materialize.css
$.validator.setDefaults({
    errorClass: 'invalid',
    validClass: 'valid',
    errorPlacement: function (error, element) {
        $(element)
            .closest("form")
            .find("label[for='" + element.attr("id") + "']")
            .attr('data-error', error.text());
    },
    submitHandler: function (form) {
        console.log('form ok');
    }
});

//Add a new rule to the validator in order to validate select boxes
 // add the rule here
 $.validator.addMethod("valueNotEquals", function(value, element, arg){
  return arg != value;
 }, "Value must not equal arg.");

 // configure your validation
 $("form").validate({
  rules: {
   SelectName: { valueNotEquals: "default" }
  },
  messages: {
   SelectName: { valueNotEquals: "Please select an item!" }
  }  
 });


/* Autocomplete for places */
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str.value)) {
        matches.push(str);
      }
    });
    console.log('LENGTH: '+matches.length);
    cb(matches);
  };
};

var dataurl = "https://swing-world-jvadillo.c9users.io/place/"

var srcPlaces = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: {
    url: dataurl,
    /*wildcard: '%QUERY',*/
    filter: function (result) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(result.places, function (place) {
              
              return {
                    value: place.placeName,
                    address: place.address,
                    countryCode: place.countryCode,
                    city: place.city,
                    lat: place.lat,
                    lon: place.lon,
                    id: place._id
                };
            });
        }
  }
});


$('#submit-event-modal #placeName').typeahead({
  
  hint: true,
  highlight: true,
  minLength: 3
  
}, {
  name: 'places',
  display: 'value',
  limit: 40,
  source: srcPlaces,
  templates: {
    suggestion: function(data) {
    return '<p><strong>' + data.value + '</strong><span class="typeahead-suggestion-subname"> '+ data.address + '</span></p>';
    }
  }
});

$('#submit-event-modal #placeName').on('typeahead:selected', function(event, datum) {
  console.log(datum);
  selectedDatum = datum;
  $('#eventAddress').val(selectedDatum.address);
  $('#city').val(selectedDatum.city);
  $('#eventLat').val(selectedDatum.lat);
  $('#eventLon').val(selectedDatum.lon);
  
  //var map = $('#location-picker-map').locationpicker('map');

  var latlon = {latitude : selectedDatum.lat, longitude: selectedDatum.lon };
  console.log(latlon);
  initLocationPicker(latlon);

  
});

/*
$('#submit-event-modal #placeName').typeahead({
  hint: true,
  highlight: true,
  minLength: 4
},
{
  name: 'cities',
  display: 'value',
  source: substringMatcher(cities),
  limit: 40,
  templates: {
    suggestion: function(data) {
    return '<p><strong>' + data.value + '</strong><span class="typeahead-suggestion-subname"> '+ data.country + '</span></p>';
    }
  }
});*/
/* .end: Autocomplete for places */


/* FACEBOOK EVENT SEARCH*/
var fbEventApiURL = "https://graph.facebook.com/v2.6/search?q=%QUERY&type=event&fields=id%2Cname%2Cowner%2Cstart_time%2Cend_time%2Ctype%2C%20cover%2C%20photos%2C%20videos%2C%20category%2Cdescription%2C%20place&access_token=EAADdsj61bhcBAIzPbD2AwqgJ0LefU3zdfhqDYZCZCdG7OKFZAOrZAfbZBZA1l8LsrRAhZAVajYLye7MwnVZClZAmbpbRVsqir4ZBeGay7MdMTL0YfeSQfSk5l6inflZA0lBmZCXvbZC1VhnRBEuodtjS29NSM";

var fbEvents = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: fbEventApiURL,
    wildcard: '%QUERY',
    filter: function (result) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(result.data, function (event) {
              var coverSource, email, owner,city,ownerId,placeName,address;
              if(event.cover && event.cover.source) {
                coverSource = event.cover.source;
              }  
              if(event.emails){
                email = event.emails[0];
              }
              if(event.owner){
                owner = event.owner.name;
                ownerId = event.owner.id;
              }
               if(event.place){
                  placeName = event.place.name;
                  if(event.place.location){
                    city = event.place.location.city;
                    address = event.place.location.street+','+city;
                  }
               }
              
              return {
                    value: event.name,
                    id: event.id,
                    description : event.description,
                    cover: coverSource,
                    owner: owner,
                    ownerId : ownerId,
                    address : address,
                    placeName : placeName,
                    city: city,
                    picture: event.picture,
                    about: event.about,
                    website: event.website,
                    email: email,
                    phone: event.phone,
                    start_time: event.start_time,
                    end_time: event.end_time,
                    single_line_address: event.single_line_address
                };
            });
        }
  }
});

$('#fbEventName').typeahead(null, {
  name: 'fb-pages',
  display: 'value',
  source: fbEvents,
  limit: 10,
  templates: {
    suggestion: function(data) {
      return '<p><strong>' + data.value + '</strong><span class="typeahead-suggestion-subname">'+ data.owner + '</span></p>';
      //return '<p><strong>' + data.value + '</strong><span class="typeahead-suggestion-subname"><i class="material-icons">person</i> '+ data.owner + '</span><span class="typeahead-suggestion-subname"><i class="material-icons">place</i> '+ data.city + '</span><div class="divider"></div></p>';
    }
  }
  
})
.on('typeahead:asyncrequest', function() {  //NOT WORKING
    $('.Typeahead-spinner').show();
})
.on('typeahead:asynccancel typeahead:asyncreceive', function() {
    $('.Typeahead-spinner').hide();
});

$('#fbEventName').on('typeahead:selected', function(event, datum) { //NOT WORKING
  console.log(datum);
  selectedDatum = datum;
  fillEventInfo(selectedDatum);
  var latlon = {latitude : selectedDatum.lat, longitude: selectedDatum.lon };
  console.log(latlon);
  initLocationPicker(latlon);
  
  //Info del organizer: /472485329561172?fields=about,contact_address,general_info,link,emails,phone,website
  //Info event: /481260538750918?fields=place,description,id,name,cover,end_time,owner,start_time,is_page_owned
  
});

function fillEventInfo(event){
  
  getOrganizerData(event.ownerId);
  
  //First step for fields: (PLACE)
  $('#eventAddress').val(event.address);
  $('#city').val(event.city);
  $('#placeName').val(event.placeName);
  $('#eventAddress').val(event.address);
  $('#city').val(event.city);
  //2nd step for fields (ORGANIZER):
  $('#organizer').val(event.owner);
  //3rd step for fields (EVENT):
  $('#title').val(event.value);

  $('#beginDate').val(event.start_time.substring(0, 10));
  /* Set the time on the timepicker */
  $('#beginHour').pickatime({
    default: event.start_time.substring(11, 16),
    twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
    donetext: 'OK',
    autoclose: false,
    vibrate: true // vibrate the device when dragging clock hand
  });
  $("label[for='beginHour']").addClass('active'); //Style hack
  $('#beginHour').val(event.start_time.substring(11, 16));
  /* .end: Set the time on the timepicker */
  
  $('#endDate').val(event.end_time.substring(0, 10));
  
  /* Set the time on the timepicker */
  $('#endHour').pickatime({
    default: event.end_time.substring(11, 16),
    twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
    donetext: 'OK',
    autoclose: false,
    vibrate: true // vibrate the device when dragging clock hand
  });
  $("label[for='endHour']").addClass('active'); //Style hack
  $('#endHour').val(event.end_time.substring(11, 16));
  /* .end: Set the time on the timepicker */
  
  $('#fb').val('https://www.facebook.com/'+event.id);
  $('#description').val(event.description);
  $('#description').trigger('autoresize'); //Autoresize after setting the text value.
  
  Materialize.updateTextFields(); //Recomended for dynamically filled values.

}

function getOrganizerData(organizerID) {
  var url = "https://graph.facebook.com/v2.6/"+organizerID+"?fields=about,contact_address,general_info,link,emails,phone,website&&access_token=EAADdsj61bhcBAIzPbD2AwqgJ0LefU3zdfhqDYZCZCdG7OKFZAOrZAfbZBZA1l8LsrRAhZAVajYLye7MwnVZClZAmbpbRVsqir4ZBeGay7MdMTL0YfeSQfSk5l6inflZA0lBmZCXvbZC1VhnRBEuodtjS29NSM";
  $.getJSON(url,function(data){
    console.log(data);
    $('#organizerWebsite').val(data.website);
    $('#organizerFb').val(data.link);
    $('#organizerEmail').val(data.emails[0]);
    $('#organizerPhone').val(data.phone);
    
    
 });
}

/*
$('#fbEventName').on('typeahead:selected', function(event, datum) { //NOT WORKING
  console.log(datum);
  selectedDatum = datum;
  
  $.getJSON("https://graph.facebook.com/v2.6/"+datum.id+"?fields=link%2C%20name%2C%20%20website%2C%20phone%2Cdescription&access_token=EAADdsj61bhcBAIzPbD2AwqgJ0LefU3zdfhqDYZCZCdG7OKFZAOrZAfbZBZA1l8LsrRAhZAVajYLye7MwnVZClZAmbpbRVsqir4ZBeGay7MdMTL0YfeSQfSk5l6inflZA0lBmZCXvbZC1VhnRBEuodtjS29NSM",function(data){
    console.log(data);
    //$('#preloadedEventHeader').data('href',data.link);
    var htmlFbHeader = '<div id="preloadedEventHeader" class="fb-page" ' +
               '   data-href="'+data.link+'" ' +
                '  data-width="640"' +
                '  data-adapt-container-width="true"' +
                '  data-hide-cover="false"' +
                '  data-show-facepile="true"></div>' +
              '</div>';
    $('#preloadedEventHeaderContainer').html(htmlFbHeader); 
    FB.XFBML.parse();
    
 });

  
  
  
});*/










$('#whole-day-box').change(function() {
    if(this.checked) {
        $('.timepicker').val('').attr('disabled','disabled');
      
    } else {
      $('.timepicker').removeAttr('disabled');
    }
});

$('#repeat-box').change(function() {
    if(this.checked) {
        $('#event-day-checkboxes').removeClass('hide')
    } else {
      $('#event-day-checkboxes').addClass('hide');
      $('#event-day-checkboxes').find('input[type=checkbox]:checked').removeAttr('checked');
    }
});



function initLocationPicker(latlon){
  
  if(!latlon){
    latlon = { latitude:0, longitude:0 };
  }
  if(!latlon.latitude) latlon.latitude = 0;
  if(!latlon.longitude) latlon.longitude = 0;
  
  $('#location-picker-map').locationpicker({
  location: latlon,
  enableAutocomplete: true,
  enableReverseGeocode: true,
  radius: 0,
  inputBinding: {
    latitudeInput: $('#eventLat'),
    longitudeInput: $('#eventLon'),
    locationNameInput: $('#eventAddress')
  },
  onchanged: function(currentLocation, radius, isMarkerDropped) {
    var addressComponents = $(this).locationpicker('map').location.addressComponents;
    console.log($(this).locationpicker('map').location); //latlon  
    updateControls(addressComponents); //Data
  }
});
}

initLocationPicker();

function updateControls(addressComponents) {
  console.log(addressComponents);
  $('#countryCode').val(addressComponents.country);
  $('#city').val(addressComponents.city);
}

//FORM STEPPER CONTROL

$('#next1').click(function(){
  var isValid = $("#new-event").valid();
  if(isValid) {
    $('#stepper1').addClass('step-done');
    $('#stepper1').removeClass('editable-step');
    $('#stepper2').addClass('active-step');
    $('#stepper2').addClass('editable-step');
    activeStep($('#step2'));
  }
});
$('#next2').click(function(){
  $('#stepper2').addClass('step-done');
  $('#stepper2').removeClass('editable-step');
  $('#stepper3').addClass('active-step');
  $('#stepper3').addClass('editable-step');
  activeStep($('#step3'));
});
$('#finish-btn').click(function(){
  //var valid = $("#new-event")[0].checkValidity();
  var isValid = $("#new-event").valid();
  
  //The jQuery Validation plugin has problem with select validation. We use html5 validation and add manually class.
  var isTypeValid = $('#eventType')[0].checkValidity();
  if(!isTypeValid) {
    $("#eventTypeInputField input").addClass("invalid");
  }
  //Multiple select validation is different:
  var isStyleValid = $('#eventStyle').val() != null &&  $('#eventStyle').val().length > 0;
  if(!isStyleValid) {
    $("#eventStylesInputField input").addClass("invalid");
  }

  if(isValid && isTypeValid && isStyleValid) {
    $('#stepper3').addClass('step-done');
    $('#stepper3').removeClass('editable-step');
    $('#submit-event-modal').addClass('submit-event-modal-finished');
    $('#submit-horizontal-stepper').addClass('hide');
    $('#steps').addClass('hide');
    activeStep($('#event-published-screen'));
    //DO SOMETHING:
    onNewEventClicked();
  }
  
});
$('#previous2').click(function(){
  $('#stepper2').removeClass('active-step').removeClass('editable-step').removeClass('step-done')
  $('#stepper1').addClass('active-step');
  $('#stepper1').addClass('editable-step');
  activeStep($('#step1'));
});
$('#previous3').click(function(){
  $('#stepper3').removeClass('active-step').removeClass('editable-step').removeClass('step-done')
  $('#stepper2').addClass('active-step');
  $('#stepper2').addClass('editable-step');
  activeStep($('#step2'));
});

function resetSubmitEventModal(){
  $('.mdl-stepper-step').removeClass('active-step').removeClass('editable-step').removeClass('step-done');
  $('#stepper1').addClass('active-step');
  $('#stepper1').addClass('editable-step');
  $('#new-event-screen').removeClass('hide');
  $('#event-published-screen').addClass('hide');
  $('#steps').addClass('hide');
  
  /*
  $('#submit-event-modal').removeClass('submit-event-modal-finished');
  $('#submit-horizontal-stepper').removeClass('hide');
  $('#event-published-screen').addClass('hide');
  
  activeStep($('#step1'));*/
}

function startPublishEventSteps(){
  $('#submit-event-modal').removeClass('submit-event-modal-finished');
  $('#submit-horizontal-stepper').removeClass('hide');
  $('#event-published-screen').addClass('hide');
  $('#new-event-screen').addClass('hide');
  $('#steps').removeClass('hide');
  activeStep($('#step1'));
  $('#location-picker-map').locationpicker('autosize');
}
$('#load-event-btn').click(function(){
  //DO STUFF for loading data from FB event.
  $('#location-picker-map').locationpicker('autosize');
  startPublishEventSteps();
});

$('#new-event-btn').click(function(){
  startPublishEventSteps();
  
});


function activeStep(stepDiv){
  $('.step').addClass('hide');
  stepDiv.removeClass('hide');
}

$('#publish-modal-publish-event-btn').click(function(){
  resetSubmitEventModal(); //Leave it prepared for later.
});
$('#publish-modal-find-events-btn').click(function(){
  resetSubmitEventModal(); //Leave it prepared for later.
  $('#submit-event-modal').closeModal();
});

//Date Picker
$('.datepicker').pickadate({
  min: new Date(),
  selectMonths: true, // Creates a dropdown to control month
  format : 'yyyy-mm-dd',
  closeOnSelect: true,
  selectYears: 15, // Creates a dropdown of 15 years to control year
  firstDay: 1,
  close: 'OK'
});

var picker = $('#beginDate').pickadate('picker');
picker.set('select', new Date());
var picker = $('#endDate').pickadate('picker');
picker.set('select', new Date());

$('select').material_select();

$('#new-event-btn').click(function(event) {
  event.preventDefault();
  /*console.log($('#new-event').serializeArray());
  console.log(JSON.stringify($('#new-event').serializeArray()));
  console.log(JSON.parse(JSON.stringify(jQuery('#new-event').serializeArray())));

  console.lof('function');*/
  //onNewEventClicked();
  
});

function onNewEventClicked(){
  var event = serializeToJSON($('#new-event'));
  postEvent(event);
}

var API_HOST_URL = "https://swing-world-jvadillo.c9users.io";
//var EVENT_API = "/events/events";
var PLACE_API = "/place";
var EVENT_API = "/place";


function postEvent(event){
  $.ajax({
    type: "POST",
    url: API_HOST_URL+EVENT_API,
    data: event,
    success: function(data){
      alert("Success!");
    }
    //dataType: dataType
  });
}
//End of FORM

var markers = {};
var places = {};
var placesArr = [];

function getEvents(){
    console.log("Loading events...");
    $.getJSON(API_HOST_URL+EVENT_API, function( data ) {
      var items = [];
      if(data.places){
        placesArr = $.map(placesArr, function(el) { return el });
        var markers = L.markerClusterGroup({ disableClusteringAtZoom: 17 });
        $.each( data.events, function( key, val ) {
          var marker = createEventMarker(val);
          console.log(marker);
          if(marker){
            //Trick for adding the ID
            marker.eventId = val._id;
          }
          markers[val._id] = marker;
          places[val._id] = val;

          if(marker) {
            markers.addLayer(marker);
          }
    		});
	      map.addLayer(markers);
      }
    });
}
function getEventsV2(){
    console.log("Loading events...");
    $.getJSON(API_HOST_URL+EVENT_API, function( data ) {
      var items = [];
      if(data.places){
        placesArr = $.map(placesArr, function(el) { return el });
        var markers = L.markerClusterGroup({ disableClusteringAtZoom: 17 });
        $.each( data.places, function( key, val ) {
          var marker = createEventMarkerV2(val);
          console.log(marker);
          if(marker){
            //Trick for adding the ID
            marker.eventId = val._id;
          }
          markers[val._id] = marker;
          places[val._id] = val;
          if(marker) {
            markers.addLayer(marker);
          }
    		});
	      map.addLayer(markers);
      }
    });
}
getEventsV2();

function createEventMarkerV2(place){
    if(place.lat && typeof place.lat !== "undefined" && place.lon && typeof place.lon !== "undefined" && place.placeName && typeof place.placeName !== "undefined"){
  		var marker = L.marker(L.latLng(place.lat, place.lon), { title: place.placeName });
  		marker.on('click', markerOnClick);
  		marker.bindPopup(place.placeName);
  		console.log("Marker created: "+place.placeName+" ("+place.lat+","+place.lon+")");
  		return marker;
    }
}

function createEventMarker(event){
    if(event.lat && typeof event.lat !== "undefined" && event.lon && typeof event.lon !== "undefined" && event.title && typeof event.title !== "undefined"){
      var title = event.title;
  		var marker = L.marker(L.latLng(event.lat, event.lon), { title: title });
  		marker.on('click', markerOnClick);
  		marker.bindPopup(title);
  		console.log("Marker created: "+title+" ("+event.lat+","+event.lon+")");
  		return marker;
    }
}

function markerOnClick(e){
  // Use the event to find the clicked element
   var el = e.target,
       id = el.eventId;
   var place = places[id];
   console.log(place);
   showPlaceEvents(place);
}

function showPlaceEvents(place){
  $('#placeNameHolder').text(place.placeName);
  $('#rightPanel').removeClass("hide");
  createEventCards(place, place.events);
}

function createEventCards(place, events){
  console.log("rendering cards...");
  var html = '<div id="eventCardsContainer">';
   $.each(events, function( key, val ) {
     html+=createEventCard(place, val);
   });
   html+='</div>';
  $('#rightPanelContent').html(html);
}

function createEventCard(place, event){
  
  var cardHTML = '<div class="card hoverable"> ' +
      '<div class="card-content white-text"> ' +
      '  <div class="card__meta"> ' +
      '    <a href="#"><i class="small material-icons">label</i>&nbsp;'+event.eventType+'</a> ' +
      '  </div> ' +
      '  <span class="card-title grey-text text-darken-4">'+event.title+'</span> ' +

      '  <p class="card-subtitle grey-text text-darken-2">'+event.description+'</p> ' +
      '  <div class="row card-row">'+
      '    <span class="text-darken-2 card-info"><i class="small material-icons">event</i>&nbsp;'+event.beginDate+'</span> ' +
      '  </div> ' +
      '</div> ' +
      '<div class="card-action"> ' +
      ' <a href="#" class="card-action-right"><i class="material-icons">&nbsp;share</i>SHARE</a> ' +
      '  <a  href="#" class="right eventDetailLink" data-place-id="'+place._id+'" data-event-id="'+event._id+'"><i class="material-icons right">&nbsp;navigate_next</i>MORE INFO</a> ' +
      '</div>'+
    '</div>';
  
    return cardHTML;
}

$('#rightPanel').on('click', 'a.eventDetailLink', function() {
    var eventId = $(this).data('event-id');
    var placeId = $(this).data('place-id');
    if(eventId && placeId){
      var events = places[placeId].events;
      $.each(events, function( key, val ) {
       if(val._id == eventId){
         createEventDetailCard(places[placeId], val);
       }
     });
    }
});
$('#rightPanel').on('click', 'a.eventDetailLink', function() {
    createEventDetailCard(event);
});


function createEventDetailCard(place, event){
  
  var cardHTML = '<div class="card card-event-detail"> ' +
       ' <div class="card-content white-text"> ' +
        '<div class="card__meta"> ' +
            '<a href="#"><i class="small material-icons">label</i>&nbsp;lindy hop, balboa, charleston</a> ' +
            
          '</div> ' +
          '<span class="card-event-title">'+event.title+'</span> ' +
    
          '<p class="card-subtitle card-event-detail-text grey-text text-darken-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...lacus eleifend lacinia... go!</p> ' +
          '<div class="row card-row"> ' +
            '<div class="col s12"> ' +
              '<span class="card-info card-event-detail-info"><i class="small material-icons">place</i>'+place.address+'</span> ' +
            '</div> ' +
          '</div> ' +
          '<div class="row card-row"> ' +
            '<div class="col s12 m6"> ' +
              '<span class="card-info card-event-detail-info"><i class="small material-icons">event</i>&nbsp;'+event.beginDate+' - '+event.endDate+'</span> ' +
            '</div> ' +
            '<div class="col s12 m6"> ' +
              '<span class="card-info card-event-detail-info"><i class="small material-icons">schedule</i>&nbsp;'+event.beginHour+' - '+event.endHour+'</span> ' +
            '</div> ' +
          '</div> ' +
          
          '<div class="row card-row"> ' +
            '<div class="col s12 m6"> ' +
              '<span class="card-info card-event-detail-info"><i class="small material-icons">local_activity</i>&nbsp;'+event.eventType+'</span> ' +
            '</div> ' +
            '<div class="col s12 m6"> ' +
              '<span class="card-info card-event-detail-info"><i class="small material-icons">credit_card</i>&nbsp;'+event.price+'</span> ' +
            '</div> ' +
          '</div> ' +
    
          '<div class="row card-row"> ' +
            '<div class="col s12"> ' +
              '<span class="card-info card-event-detail-info"><i class="small material-icons">public</i>&nbsp;'+event.web+'</span> ' +
            '</div> ' +
          '</div> ' +
        '</div> ' +
        
        '<div class="card-action"> ' +
          '<a href="#"><i class="material-icons">&nbsp;language</i>oVISIT WEB</a> ' +
          '<a href="#" class="card-action-right right"><i class="material-icons">&nbsp;share</i>SHARE</a> ' +
        '</div> ' +
      '</div>';
      
      cardHTML += '<div class="card card-event-detail"> ' +
       
       '<div class="fb-page" data-href="https://www.facebook.com/SAVOYSWINGUP" data-tabs="timeline" data-width="500" data-height="800" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-adapt-container-width="true"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/SAVOYSWINGUP"><a href="https://www.facebook.com/SAVOYSWINGUP">SAVOY Swing Up</a></blockquote></div></div> ' +

      '</div>';
       
      $('#eventCardsContainer').html(cardHTML);
      //The following sentence must be used for re-rendering Facebook dynamic content. 
      FB.XFBML.parse();
  
  return cardHTML;
}

/* HELPERS */
function serializeToJSON(form) {
  var jsonData = {};
  console.log('......serializeToJSON');
  var formData = form.serializeArray();
  $.each(formData, function() {
    if (jsonData[this.name]) {
      if (!jsonData[this.name].push) {
        jsonData[this.name] = [jsonData[this.name]];
      }
      jsonData[this.name].push(this.value || '');
    } else {
      jsonData[this.name] = this.value || '';
    }
  });
  console.log('......serializeToJSON');
  console.log(jsonData);
  return jsonData;
}

/*** EVENT JSON EXAMPLE ***/
var event = {
address: "Plaza Puerta del Sol, 11, 28013 Madrid, Madrid, España",
beginDate:"2016-05-25",
beginHour:"07:30",
description:"Describe asdf asdf asdf asd fds f  asdf asdf asd fds f asdf asdf asd fds f asdf asdf asd fds f asdf asdf asd fds f asdf a",
email:"email@email.com",
endDate:"2016-05-25",
endHour:"06:30",
event_type:"class",
lat:"40.4167754",
lon:"-3.703790199999576",
organizer:"Organizer asdf asdf asdf asd fds f",
repeat:["1","2","3"],
styles:["blues","balboa","charleston"],
title:"Title asdf asdf asdf asd fds f",
web:"www.event.com"
}