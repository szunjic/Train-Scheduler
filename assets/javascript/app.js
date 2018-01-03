$(document).ready(function () {
// Initialize Firebase
var config = {
	apiKey: "AIzaSyDkgxQKEgmnaFMJR9Sy0C69BmOLDwOoAes",
    authDomain: "train-scheduler-66acf.firebaseapp.com",
    databaseURL: "https://train-scheduler-66acf.firebaseio.com",
    projectId: "train-scheduler-66acf",
    storageBucket: "train-scheduler-66acf.appspot.com",
    messagingSenderId: "243535730776"
};

firebase.initializeApp(config);

// Storing database in a variable
var database = firebase.database();

// Submit button for adding trains
$("#add-train").on("click", function() {
	event.preventDefault();

	// Grab user input
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	//var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("HH:mm");
	var firstTrain = $("#first-train-input").val().trim();
	var frequency = $("#frequency-input").val().trim();

	// Create local "temporary" object for holding train data
	var newTrain = {
		name: trainName,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency
	}

	// Upload train data to the database
	database.ref().push(newTrain);

	// Log everything to console
	console.log(newTrain.name);
  	console.log(newTrain.destination);
  	console.log(newTrain.firstTrain);
  	console.log(newTrain.frequency);

  	// Alert
  	alert("Train successfully added");

  	// Clear inputs
  	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-input").val("");
	$("#frequency-input").val("");

	// Determine when the next train arrives.
  	return false;
});

// Create Firebase event for adding trains to the database,
// and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	var data = childSnapshot.val();
	console.log(data);

	// Store everything into a variable
	var tName = data.name;
	var tDestination = data.destination;
	var tFrequency = data.frequency;
	var tFirstTrain = data.firstTrain;

	// Log everything to console
	console.log("name: " + tName);
	console.log("destination: " + tDestination);
	console.log("frequency: " + tFrequency);
	console.log("first train: " + tFirstTrain);

	var timeArr = tFirstTrain.split(":");
	var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
	var maxMoment = moment.max(moment(), trainTime);
	var tMinutes;
	var tArrival;

	// If the first train is later that the current time,
	// set arrival to the first train time 
	if (maxMoment === trainTime) {
		tArrival = trainTime.format("hh:mm A");
		tMinutes = trainTime.diff(moment(), "minutes")
	} else {
		// Calculate minutes to arrival 
			// Take current time in unix and subtract the firstTrain time
			// Find modulus between the difference and frequency
		var differenceTimes = moment().diff(trainTime, "minutes");
		var tRemainder = differenceTimes % tFrequency;
		tMinutes = tFrequency - tRemainder;
		// Calculate arrival time by adding tMinutes to the current time
		tArrival = moment().add(tMinutes, "m").format("hh:mm A");
	}

	console.log("tMinutes:", tMinutes);
	console.log("tArrival:", tArrival);

	// Add each train's data into the table 
	$("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
    tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
 

});

})