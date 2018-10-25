//TRAIN SCHEDULER

//INITIALIZE FIREBASE

var config = {
  apiKey: "AIzaSyDgvtVbko6celjo8pn5apM14f-WOoxH27w",
  authDomain: "train-scheduler-e50a7.firebaseapp.com",
  databaseURL: "https://train-scheduler-e50a7.firebaseio.com",
  projectId: "train-scheduler-e50a7",
  storageBucket: "train-scheduler-e50a7.appspot.com",
  messagingSenderId: "638077601036"
};

firebase.initializeApp(config);

var database = firebase.database();

//ADD TRAIN CLICK EVENT

$("#add-train-button").on("click", function(event) {
  event.preventDefault();

  //Gets user input
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = $("#first-train-time").val().trim();
  var frequency = $("#frequency").val().trim();

  //Validates user input
  //Checks to see if firstTrainTime input is 5 characters long as has ":" at the third character
  if (firstTrainTime.length === 5 && firstTrainTime[2] === ":") {
    var timeFormat = true;
  }
  else {
    timeFormat = false;
  }
  //Splits firstTrainTime into two strings
  var timeArray = firstTrainTime.split(":");

  //Checks to see if both numbers are within valid range
  if (parseInt(timeArray[0]) <= 23 && parseInt(timeArray[1]) <=59) {
    var timeRange = true;
  }
  else {
    timeRange = false;
  }

  //If conditions for user firstTrainTime input are not met: give error message, clear input box, and exit the click event
  if (timeFormat === false || timeRange === false) {
    $("#error-msg").text("Please enter time in 24-hr (HH:mm) format only!");
    $("#error-msg").css("color", "red");
    document.getElementById("first-train-time").value = "";
    return;
  }

  //If conditions for user frequency input are not met: give error message, clear input box, and exit the click event
  if (isNaN(parseInt(frequency))) {
    $("#error-mes").text("Please enter a number (in minutes) only!");
    $("#error-mes").css("color", "red");
    document.getElementById("frequency").value = "";
    return;
  }

  //User input is validated and accepted
  //Restore form text
  $("#error-msg").text("First Train Time (HH:mm - military time)");
  $("#error-msg").css("color", "#9e9e9e");
  $("#error-mes").text("Frequency (min)");
  $("#error-mes").css("color", "#9e9e9e");
  
  //Creates temp object for train data
  var trainObject = {
    name: trainName,
    dest: destination,
    ftt: firstTrainTime,
    freq: frequency
  };

  //Pushes train data to database
  database.ref().push(trainObject);

  //Clears input boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
});

//CREATE FIREBASE EVENT FOR ADDING NEW TRAINS TO DOM

//Takes snapshot of database
database.ref().on("child_added", function(trainSnapshot) {

  //Saves values to variables
  var trainName = trainSnapshot.val().name;
  var destination = trainSnapshot.val().dest;
  var firstTrainTime = trainSnapshot.val().ftt;
  var frequency = trainSnapshot.val().freq;

  //Calculate "next arrival time" and "minutes away"
  var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  var currentTime = moment();
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var remainder = diffTime % frequency;
  var minutesAway = frequency - remainder;
  var nextArrival = moment().add(minutesAway, "minutes");

  //Creates new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(moment(nextArrival).format("hh:mm")),
    $("<td>").text(minutesAway)
  );

  //Appends new row to table
  $("#train-schedule > tbody").append(newRow);
});
  