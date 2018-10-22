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

  //confirm?

  //Clears input boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
});

//CREATE FIREBASE EVENT FOR ADDING NEW TRAINS TO DATABASE AND DOM

//Takes snapshot of database
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  //Saves values to variables
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTrainTime = childSnapshot.val().ftt;
  var frequency = childSnapshot.val().freq;

  //logs new train to console
  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  //Format/"prettify" first train time

  //Calculate "next arrival time" and "minutes away"
  var nextArrival;
  var minutesAway;

  //Creates new row
  var newRow = $("#last-row").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesAway)
  );

  //Appends new row to table
  $("#train-schedule > tbody").append(newRow);
});
  