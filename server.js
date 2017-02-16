'use strict';

var port = 5000;
var io = require('socket.io')(port);

function log(text){
    var d = new Date();
    var dateReadOut = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());    
    console.log("["+dateReadOut+"] "+text); 
};

log('EMDESKv2 Validation Socket is listen to localhost:' + port);

io.on('connection', function(socket) {
    var self = this;
    var connection = socket;

    connection.on('disconnect', function(s){
        log(connection.id + ' left');
    });

    connection.on('invalidate', function(data){
        log('invalidate ' + data['checksum'] + ' in project #' + data['project']);
        io.to(data['project']).emit("update", data);
    });

    connection.on('share', function(data) {
        
    });
    
    connection.on('join', function(data) {        
        connection.join( data['project'] );
        log(connection.id + ' enlisted project #' + data['project']);
    });

});