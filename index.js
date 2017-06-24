var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

var room = require('./scripts/room');
var server = require('./scripts/server');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/room/:id', function(req, res){
    res.render('room');
});

app.get('/room/create', function(req, res){
    res.render('create');
});

app.get('/account/', function(req, res){
    res.render('account');
});

io.on('connection', function(socket){
    console.log('user connected');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
