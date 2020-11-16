function sockets(io, socket, data) {
    socket.on('setupWavelength', function(d) {
      data.createRoom(d);
    })
    socket.on('wavelengthLoaded', function(d) {
      socket.join(d.roomId);
      socket.emit('wavelengthLabels', data.getUILabels());
      socket.emit('newMission', data.getCurrentMission(d.roomId));
    });
    socket.on('wavelengthUpdate', function(d) {
      //points to the winning team
      io.to(d.roomId).emit('newMission', data.getNewMission(d.roomId));
    });
    socket.on('wavelengthReveal', function(d) {
      io.to(d.roomId).emit('wavelengthRevealed')
    });
    socket.on('wavelengthHide', function(d) {
      io.to(d.roomId).emit('wavelengthHidden')
    });
    socket.on('wavelengthMoveDial', function(d) {
      io.to(d.roomId).emit('wavelengthDialMoved', {x: d.x, y: d.y})
    });
}

module.exports = sockets;