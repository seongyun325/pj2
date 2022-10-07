var express  = require('express');

var app      = express();

//var app      = require('express')();

 

//var http     = require('http');

//var server   = http.Server(app);

var http     = require('http').Server(app);

 

//var socketio = require('socket.io');

//var io       = socketio(server);

var io       = require('socket.io')(http);

 

const path = require('path');

 

var SerialPort = require('serialport').SerialPort;

var ReadlineParser = require('@serialport/parser-readline').ReadlineParser;

var parsers    = SerialPort.parsers;

var sp = new SerialPort( {

  path:'COM6',

  baudRate: 9600

});

var parser     = sp.pipe(new ReadlineParser({

  delimiter: '\r\n'

}));

 

 

 

var port = 3000;

 

sp.pipe(parser);

 

sp.on('open', () => console.log('Port open'));

 

parser.on('data', function(data)

{

	console.log(data.toString());

	if(data.substring(0,3) == "bucket"){

		if(data.substring(3,4) == "1")	bucketStatus = "on";

		else							bucketStatus = "off";

		io.emit('bucket', bucketStatus);

		console.log('bucket status: ' + bucketStatus);

	}

	else if(data.substring(0,3) == "adc"){

		adcValue = data.substring(3);

		io.emit('adc', adcValue);

		console.log('adc value: ' + adcValue);

	}

});

 

app.get('/open',function(req,res)

{

	sp.write('led1\n\r', function(err){

		if (err) {

            return console.log('Error on write: ', err.message);

        }

        console.log('send: bucket open');

		res.writeHead(200, {'Content-Type': 'text/plain'});

		res.end('bucket open\n');

	});

});

 

app.get('/close',function(req,res)

{

	sp.write('led0\n\r', function(err){

		if (err) {

            return console.log('Error on write: ', err.message);

        }

        console.log('send: bucket close');

		res.writeHead(200, {'Content-Type': 'text/plain'});

		res.end('bucket close\n');

	}); 

});

 

app.use(express.static(__dirname + '/public'));

 

http.listen(port, function() {  // server.listen(port, function() {

    console.log('listening on *:' + port);

});