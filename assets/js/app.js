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
  var firstTrainTime = moment($("#first-train-time").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $("#frequency").val().trim();

  //Validates user input - ADD CODE
    //Create variable with regular expression of required time format
    //Compare user input to regex
    //If user input is not equal to regex, exit function and prompt user with correct format and visual feedback (e.g. red)
    //If user input is equal to regex, continue with function execution
  

  //Creates temp object for train data
  var trainObject = {
    name: trainName,
    dest: destination,
    ftt: firstTrainTime,
    freq: frequency
  };

  //Pushes train data to database
  database.ref().push(trainObject);

  //Logs user input to console
  console.log(trainObject.name);
  console.log(trainObject.dest);
  console.log(trainObject.ftt);
  console.log(trainObject.freq);

  //Clears input boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
});

//CREATE FIREBASE EVENT FOR ADDING NEW TRAINS TO DOM

//Takes snapshot of database
database.ref().on("child_added", function(trainSnapshot) {
  console.log(trainSnapshot.val());

  //Saves values to variables
  var trainName = trainSnapshot.val().name;
  var destination = trainSnapshot.val().dest;
  var firstTrainTime = trainSnapshot.val().ftt;
  var frequency = trainSnapshot.val().freq;

  //logs new train to console
  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

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
  