var express  = require('express');
var app      = express();
var http     = require('http').Server(app);
var io       = require('socket.io')(http);
var tmp;

const path = require('path');
var SerialPort = require('serialport').SerialPort;
var ReadlineParser = require('@serialport/parser-readline').ReadlineParser;
var parsers    = SerialPort.parsers;
var sp = new SerialPort( {

  path:'/dev/ttyUSB0',

  baudRate: 9600

});

var parser     = sp.pipe(new ReadlineParser({

  delimiter: '\n'

}));

var port = 3000;

sp.pipe(parser);
sp.on('open', () => console.log('Port open'));

parser.on('data', function(data)
{

   if (data.substring(0, 3) == "dis") {
      val = data.substring(3);
      distance = parseInt(val);
      console.log('distance: ' + distance);
        if (distance < 40) {
         	// 1. child-process모듈의 spawn 취득
		    const spawn = require('child_process').spawn;
            // 2. spawn을 통해 "python 파이썬파일.py" 명령어 실행
            const result = spawn('python3', ['yolo_uvc2.py']);
/*			// child-process에서 linux 명령어 실행가능
			var exec = require('child_process').exec,
			child;
			
			
			child = exec("./kill", function (error, stdout, stderr) {
				console.log('' + stdout);
				console.log('' + stderr);
				if (error !== null) {
					console.log('' + error);
				}
			});	
*/
         // 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
         result.stdout.on('data', function(data) {
            //console.log(data.toString());
           	var str = data.toString();
           	var str_ = str.substr(0,3);
           	console.log(str_);
           	
            if (str_ == "cow") {
              sp.write('servo2\n\r', function(err){
              if (err) {
                  return console.log('Error on write: ', err.message);
              }
              console.log('send: bucket open');
              });
            }
         });

         // 4. 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
         result.stderr.on('data', function(data) {
            console.log(data.toString());
         });
        }
    }
});      
      
app.get('/open',function(req,res)

{

   sp.write('servo1\n\r', function(err){

      if (err) {

            return console.log('Error on write: ', err.message);

        }

        console.log('send: bucket open');

      res.writeHead(200, {'Content-Type': 'text/plain'});

   });

});

app.get('/close',function(req,res)

{

   sp.write('0\n\r', function(err){

      if (err) {

            return console.log('Error on write: ', err.message);

        }

        console.log('send: bucket close');

      res.writeHead(200, {'Content-Type': 'text/plain'});

   }); 

});
 

app.use(express.static(__dirname + '/public'));

 
http.listen(port, function() {  // server.listen(port, function() {

    console.log('listening on *:' + port);

});
