'use strict';

var port = 5000;
var io = require('socket.io')(port);

function log(text) {
    var d = new Date();
    var dateReadOut = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
    console.log("[" + dateReadOut + "] " + text);
};

log('EMDESKv2 Validation Socket is listen to localhost:' + port);

io.on('connection', function (socket) {
    var self = this;
    var connection = socket;

    connection.on('disconnect', function (s) {
        log(connection.id + ' left');
    });

    connection.on('invalidate', function (data) {
        log('invalidate ' + data['routes'].length + ' route(s) and ' + data['tokens'].length + ' token(s) in project #' + data['project']);
        for (var n = 0; n < data['routes'].length; n++) {
            io.to(data['project']).emit("routeUpdate", data['routes'][n]);
            log('invalidate ' + data['routes'][n].name + ' in project #' + data['project']);
        }
    });

    connection.on('share', function (data) {

    });

    connection.on('join', function (data) {
        connection.join(data['project']);
        log(connection.id + ' enlisted project #' + data['project']);
    });


    /* Notification Socket */
    socket.on('notification_join', function (data) {
        socket.join('notificationUser_' + data);
        log('User Join: ' + data);
    });

    socket.on('new_notifications', function (data) {
        log('new Notifications for ' + data['users'].length + ' User(s)');
        for (var n = 0; n < data['users'].length; n++) {
            socket.to('notificationUser_' + data['users'][n]).emit("new_notification");
            log('notify User ' + data['users'][n] + ' - new Notifications!!');
        }
    });


});
