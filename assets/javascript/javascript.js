// Set Variables
var url ="https://train-scheduler-5685c.firebaseio.com";
var dataRef = new Firebase(url);

var trainName ='';
var destination = '';
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainSch = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var timeRemain = '';
var minutesTillNext = '';
var trainPush = '';
var deleteTrain = '';

// Document.ready to run after HTML
  $(document).ready(function() {

// Event on click; AJAX used to add trains
  $("#add-train").on("click", function() {

     	name = $('#nameAdd').val().trim();
     	destination = $('#destinationAdd').val().trim();
     	firstTrainTime = $('#firstTrain').val().trim();
     	frequency = $('#frequencyAdd').val().trim();

          firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
          currentTime = moment();
          diffTime = moment().diff(moment.unix(firstTimeConverted), "minutes");
          timeRemain = diffTime % frequency;
          minutesTillNext = frequency - timeRemain;
          nextTrain = moment().add(minutesTillNext, "minutes");
          nextTrainSch = moment(nextTrain).format("hh:mm");

// Push
     	trainPush = dataRef.push({
     		trainName: trainName,
     		destination: destination,
     		firstTrainTime: firstTrainTime,
     		frequency: frequency,
        nextTrainSch: nextTrainSch,
        minutesTillNext: minutesTillNext
     	});

      $('#nameAdd').val('');
     	$('#destinationAdd').val('');
     	$('#firstTrain').val('');
     	$('#frequencyAdd').val('');

     	return false;
     });
     dataRef.on("child_added", function(childSnapshot) {


		$('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().name +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainSch +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().minutesTillNext +
               "</td>" +
               "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
          "</tr>");

}, function(errorObject){
});

// On click event available to remove trains that have been added
$("body").on("click", ".remove-train", function(){
     $(this).closest ('tr').remove();
     deleteTrain = $(this).parent().parent().attr('id');
     dataRef.child(deleteTrain).remove();
   });
});
