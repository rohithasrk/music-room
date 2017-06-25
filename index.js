var express = require('express');
var app = express();
var mysql = require('mysql');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var timesyncServer = require('timesync/server');

var Room = require('./scripts/room');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hello",
  database: "musicroom"
});


app.use('/static', express.static('public'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('timesync', timesyncServer.requestHandler);

http.listen(8080, function(){
    console.log('listening on *:8080');
});

Room.io = io;

app.get('/', function(req, res){
    res.render('index');
});

app.get('/room/:id', function(req, res){
    res.render('room');
});

app.get('/create/room', function(req, res){
    res.render('usercreate');
});

app.get('/account/', function(req, res){
    res.render('account');
});

var activeRooms = "";
io.on('connection', function(socket){
    console.log('User connected');

    socket.on('joinRoom', function(username) {
        room = Room.joinRoom(socket, username);
        socket.emit('openLink', room.selectedTrack);
        console.log("Joining " + username + "'s room");
    });
    
    socket.on('createRoom', function(username) {
        socket.emit('copyLink', base_url + '/room/' + username);
        activeRooms = activeRooms + " " + base_url + '/room/' + username;
        console.log("Created a new room");
    });
    
    socket.on('playSong', function(username, songUrl) {
        console.log(songUrl);
        socket.emit('openLink', songUrl);
        console.log("Opening the song link");
    });
});

var JSON = require('JSON');

app.post('/signin', function(req, res){
  if (req.method == 'POST') {
    con.connect(function(err){
      if(err) throw err;
      var body = "";
      req.on('data',function(data){
          body +=data;
        });
        var data = {};
        var uname = '';
        var pass = '';
        req.on('end', function () {
        body = body.split("&");
        uname = body[0].split("=")[1];
        pass = body[1].split("=")[1];
  
        var sql = 'SELECT * FROM user where username="'+uname+'" and password="'+pass+'"';
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("user found");
            res.redirect('/');

          }); 
      });
    });
  }

});

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
            res.redirect('/');

          }); 
      });
        });   
        }

    });
