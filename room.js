function Room(name) {
    this.name = name;
    this.startTime;
    this.selectedTrack = "";
}

Room.rooms = {};

Room.createRoom = function(socket, username) {
    var rooms = Room.rooms;
    console.log("Created a room");
    rooms[username] = new Room(username);
    var room = rooms[id];
    room.name = username;
    socket.join(username);
    socket.room = room;
    return room;
};

Room.joinRoom = function(socket, username) {
    console.log("Joined the room");
    var rooms = Room.rooms;
    if(rooms[username] === null)
    {
        return;
    }
    var room = rooms[username]
    socket.join(username);
    socket.room = room;
    return room;
};

module.exports = Room;
