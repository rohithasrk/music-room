var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var timesyncServer = require('timesync/server');

var Room = require('./scripts/room');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('timesync', timesyncServer.requestHandler);

http.listen(3000, function(){
    console.log('listening on *:3000');
});

Room.io = io;

app.get('/', function(req, res){
    res.render('index');
});

app.get('/room/:id', function(req, res){
    res.render('room');
});

app.get('/create/room', function(req, res){
    res.render('create');
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
