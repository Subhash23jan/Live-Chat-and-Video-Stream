const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const express = require('express');
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
  
const { Server } = require('ws');

const ws = new Server({ server });

ws.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (msg) => {
    
    // Parse the received JSON data
        const data = JSON.parse(msg);
        console.log(data);
        ws.clients.forEach((client) => {
            if(client!==socket && client.readyState === socket.OPEN)
             client.send(JSON.stringify({ name: data.name, message: data.message,eventType:data.eventType }));
        });
});

});