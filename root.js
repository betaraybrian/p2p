var http = require("http");
var request = require('request');
var Gpio = require('onoff').Gpio,
sensor = new Gpio(17, 'in', 'both');

var port = 8686;

var infraValue = 0;

http.createServer(function(req,res){
	console.log('New incoming client request for ' + req.url);
	res.writeHeader(200, {'Content-Type': 'application/json'});
	switch(req.url) {
		case '/temperature':
			sensor.watch(function (err, value) {
				if (err) exit(err);
					console.log(value ? 'there is some one!' : 'not anymore!');
					infraValue = value;
				});
				function exit(err) {
					if (err) console.log('An error occurred: ' + err);
						sensor.unexport();
						console.log('Bye, bye!')
						process.exit();
					}
				process.on('SIGINT', exit);
				res.write('{"Result" :' + infraValue ? 'there is some one!' : 'not anymore!');
			break;
		case '/light':
			res.write('{"light" :' + '}');
			break;
		default:
			res.write('{"hello" : "world"}');
		}
res.end();
}).listen(port);
console.log('Server listening on http://localhost:' + port);