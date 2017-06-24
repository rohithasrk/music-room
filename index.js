var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

var room = require('./scripts/room');
var server = require('./scripts/server');

var mysql = require('mysql');
var JSON = require('JSON');
var querystring = require('querystring');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hello",
  database: "musicroom"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql!");
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index');
});

//app.get('/room/:id', function(req, res){
 //   res.render('room');
//});

app.get('/create/room', function(req, res){
    res.render('userform');
});

app.get('/account/', function(req, res){
    res.render('account');
});

io.on('connection', function(socket){
    console.log('user connected');
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});

var JSON = require('JSON');
app.post('/usercreate', function(req, res){
   
    if (req.method == 'POST') {
    	 console.log("hello");
        con.connect(function(err) {
  			if (err) throw err;
  			var body = "";
  			req.on('data',function(data){
  				body +=data;
  			});
  			var data = {};
  			var i = '';
  			var j = '';
  			var k = '';
  			req.on('end', function () {
				body = body.split("&");
				is = body[0].split("=")[1];
				js = body[1].split("=")[1];
				ks = body[2].split("=")[1];
				var sql = 'INSERT INTO user (username, email, password) VALUES ("'+is+'","'+js+'","'+ ks+'")';
  				con.query(sql, function (err, result) {
  					if (err) throw err;
    				console.log("1 record inserted");
  				});	


 			});

  			});		
        }
    });
    
		