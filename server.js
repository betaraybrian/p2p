var http = require("http");
var request = require('request');

var express = require('express');
var app = express();

var onoff = require('onoff');
var Gpio = onoff.Gpio,
	led = new Gpio(4, 'out'),
	sensor = new Gpio(17, 'in', 'both');


var port = 8686;

var infraValue = 0;

var ledon = false;


//root page
app.get('/', function (req, res) {
  res.send('Welcome to our Raspberry Pi!' + '<br>' + 'Here are our devices:' + '<br>' + '<a href="/sensors">Sensors</a>' + '<br>' + '<a href="/actuators">Actuators</a>')
  res.end();
})

//sensor page
app.get('/sensors', function (req, res){
	res.send('Here is a list of sensors:' + '<br>' + '<a href="/sensors/infrared">Infrared Sensor</a>')
	res.end();
})

//actuator page
app.get('/actuators', function (req, res){
	res.send('Here is a list of actuators:' + '<br>' + '<a href="/actuators/led1">First LED</a>')
	res.end();
})

//LED1 page
app.get('/actuators/led1', function (req, res){
	res.send('<button type="button" onclick="ledonoff();">Turn on/off</button>')
	res.end();
})

//infrared page
app.get('/sensors/infrared', function (req, res){
	res.send('Infrared')
	sensor.watch(readInfrared)
	res.end();
})


//log
app.listen(port, function () {
  console.log('Example app listening on port:' + port);
})

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
	}
}

function readInfrared(err, value){
	//if (err) exit(err);
	console.log("Value" + value);
	if (value == 0){

	}else{
		
	}
}

//stop GPIO
process.on('SIGINT', function () {
	led.writeSync(0);
	led.unexport();
	sensor.unexport();
	console.log('Bye, bye!');
	process.exit();
});
