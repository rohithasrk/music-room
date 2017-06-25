var express = require('express');
var app = express();
var mysql = require('mysql');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Room = require('./room');
var config = require('./config/config.json');
var baseUrl = config.base_url;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hello",
  database: "musicroom"
});


app.use('/static', express.static('public'))
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('port',(process.env.PORT || 3000));

http.listen(app.get('port'), function(){
    console.log('listening to port number '+ app.get('port'));
});

Room.io = io;

app.get('/', function(req, res){
    res.render('index', {'username':"rohithasrk"});
});

app.get('/room/:id', function(req, res){
    res.render('room', {'iscreator':'hidden'});
});

app.get('/create/room/:id', function(req, res){
    res.render('room', {'iscreator': 'visible'});
});

app.get('/account/', function(req, res){
    res.render('account');
});

var activeRooms = "";
var currentTrack;
var songStart;
var timeRelapsed = 0;
io.on('connection', function(socket){
    console.log('User connected');
    
    socket.on('startSetter', function(msg) {
        console.log("Socked recieved");
        if(!Room.isStartTime) {
            Room.isStartTIme = true;
            Room.startTime = msg;
        }
        console.log(Room.startTime);
        socket.emit('start', Room.startTime);
    });

    socket.on('joinRoom', function(username) {
        room = Room.joinRoom(socket, username);
        socket.emit('openLink', room.selectedTrack);
        console.log("Joining " + username + "'s room");
    });
    
    socket.on('createRoom', function(username) {
        var d = new Date()
        songStart = d.getTime()
        socket.emit('copyLink', baseUrl + '/room/' + username);
        activeRooms = activeRooms + " " + baseUrl + '/room/' + username;
        console.log(activeRooms);
        console.log("Created a new room");
    });
    
    socket.on('playSong', function(username, songUrl) {
        currentTrack = songUrl;
        console.log(currentTrack);
        socket.emit('openLink', songUrl);
    });
    
    socket.on('test', function(username) {
        console.log("Inside test function");
        var d = new Date()
        var currentTime = d.getTime();
        timeRelapsed = Math.floor((currentTime-songStart)/1000);
        socket.emit('testBack', currentTrack, timeRelapsed);
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
