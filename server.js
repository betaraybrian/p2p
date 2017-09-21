var http = require("http");
var request = require('request');

var express = require('express');
var app = express();

var onoff = require('onoff');
var Gpio = onoff.Gpio,
	led = new Gpio(4, 'out');


var port = 8686;

var infraValue = 0;

var ledon = false;

function ledonoff(){
	if (ledon == false){
		led.write(1, function() {
			console.log("Changed LED state to: On");
			ledon = true;
		});
	}else{
		led.write(0, function() {
			console.log("Changed LED state to: Off");
			ledon = false;
		});

		process.on('SIGINT', function () {
		led.writeSync(0);
		led.unexport();
		console.log('Bye, bye!');
		process.exit();
		});
	}
}



//root page
app.get('/', function (req, res) {
  res.send('Welcome to our Raspberry Pi!' + '<br>' + 'Here are our devices:' + '<br>' + '<a href="/sensors">Sensors</a>' + '<br>' + '<a href="/actuators">Actuators</a>')
})

//sensor page
app.get('/sensors', function (req, res){
	res.send('Here is a list of sensors:' + '<br>' + '<a href="/sensors/infrared">Infrared Sensor</a>')
})

//actuator page
app.get('/actuators', function (req, res){
	res.send('Here is a list of actuators:' + '<br>' + '<a href="/actuators/led1">First LED</a>')
})

//LED1 page
app.get('/actuators/led1', function (req, res){
	res.send('LED1' + '<button type = button" onclick ="ledonoff()">Turn on/off</button>')
})

//infrared page
app.get('/sensors/infrared', function (req, res){
	res.send('Infrared')
})


//log
app.listen(port, function () {
  console.log('Example app listening on port:' + port);
})