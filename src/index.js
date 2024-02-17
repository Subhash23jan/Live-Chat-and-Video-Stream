const websocket = require('ws');
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, '/src')));
app.listen(5000, () => {

    console.log('Server is running on port 5000');
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
const ws = new websocket.Server({ port: 5010 })

ws.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (msg) => {
    
    // Parse the received JSON data
        const data = JSON.parse(msg);
        console.log(data);
        ws.clients.forEach((client) => {
            if(client!==socket && client.readyState === websocket.OPEN)
            client.send(JSON.stringify({ name: data.name, message: data.message }));
        });
});

});