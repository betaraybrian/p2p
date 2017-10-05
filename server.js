var http = require("http");
var request = require('request');

var express = require('express');
var app = express();

var path = require("path");

var onoff = require('onoff');
var Gpio = onoff.Gpio,
	led = new Gpio(4, 'out'),
	sensor = new Gpio(17, 'in', 'both');

var networkIP = "192.168.43.193";
var networkPort = 2000;

var piIP = "192.168.43.247";

var port = 8686;

var infraValue = 0;

var ledon = false;


//root page
app.get('/pi', function (req, res) {
  res.send('Welcome to our Raspberry Pi!' + '<br>' + 'Here are our devices:' + '<br>' + '<a href="/sensors">Sensors</a>' + '<br>' + '<a href="/actuators">Actuators</a>')
  res.end();
})

//sensor page
app.get('/pi/sensors', function (req, res){
	res.send('Here is a list of sensors:' + '<br>' + '<a href="/sensors/infrared">Infrared Sensor</a>')
	res.end();
})

//actuator page
app.get('/pi/actuators', function (req, res){
	res.send('Here is a list of actuators:' + '<br>' + '<a href="/actuators/led1">First LED</a>')
	res.end();
})

//LED1 page
app.get('/pi/actuators/led1', function (req, res){
	res.send('Turn the LED on and off' + '<br>' + '<form action=\"/actuators/led1/ledOnOff\" method=\"post\"> <input type=\"submit\" value=\"Turn LED On / Off\"></form>')

})

app.get('/pi/actuators/led1/status', function (req, res){
	res.writeHeader(200, {'Content-Type': 'application/json'});
	res.write('{"status: " :' + ledon + '}');
})

//infrared page
app.get('/pi/sensors/infrared', function (req, res){
	res.writeHeader(200, {'Content-Type': 'application/json'});
	res.write('{"value: " :' + infraValue + '}');
	res.end();
})


//log
app.listen(port, function () {
  console.log('Example app listening on port:' + port);
})

//turn led on/off
app.post('/pi/actuators/led1/ledOnOff', function(req, res){
	ledonoff();
})

//turn led on/off
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


//read infrared value
sensor.watch(function (err, value) {
	console.log("Value" + value);
	infraValue = value;
});

//stop GPIO
process.on('SIGINT', function () {
	led.writeSync(0);
	led.unexport();
	sensor.unexport();
	console.log('Bye, bye!');
	process.exit();
});


function startUp(){
	sendConnectToNetwork(networkIP, networkPort, piIP + ":" + port + "/pi/sensors/infrared", 10, function(error, response, body){

	});
}

function sendConnectToNetwork(IP, Port, url, refreshrate, callbackFunction){

	var options = {
    uri: 'http://'+IP+':'+Port+'/connect',
    headers: {
      'url': url,
      'refreshrate': refreshrate
    }
    
  };
request(options, callbackFunction);
}

startUp();
