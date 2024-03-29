const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const express = require('express');
const http = require('http');
const path = require('path');
const visitorTrack = require('./visitors_tracking/files');
const adminAuthentication = require('./authentication/admin');
const downloadVisitorData = require('./visitors_tracking/files');


const app = express();
app.use(express.json());
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'src')));
// app.use(visitorTrack);
app.get('/',visitorTrack, (req, res) => {
  res.sendFile(path.join(__dirname, INDEX));
});
app.get('/details', adminAuthentication, (req, res) => { 
    console.log('Download Visitor Data');
  const filePath = path.join(__dirname, '/visitors_tracking/visitors.json');
  console.log(filePath);
    res.download(filePath);
});
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});


const { Server } = require('ws');
const { createServer } = require('wss');

const ws = new Server({ server });
const connectedClients = new Set(); // Using Set to ensure unique clients
ws.on('connection', (socket) => {
  console.log('New client connected');
  //console.log(socket);
  connectedClients.add(socket);

  // Send the new client the list of connected clients
  // connectedClients.forEach((client) => {
  //   if (client.readyState === socket.OPEN) {
  //     client.send(JSON.stringify({ name: 'Server', message: connectedClients.size, eventType: 'connection' }));
  //   }
  // });

  socket.on('message', (msg) => {
    // Parse the received JSON data
    const data = JSON.parse(msg);
  //  console.log(data);
    connectedClients.forEach((client) => {
      if (client.readyState === socket.OPEN) {
        if (data.eventType === 'connection') {
          if (client !== socket) client.send(JSON.stringify({ name: data.name, message: connectedClients.size, eventType: data.eventType }));
              else client.send(JSON.stringify({ name: 'You', message: connectedClients.size,  eventType: data.eventType }));
        }
        else if (data.eventType === 'disconnection') {
         if (client !== socket) client.send(JSON.stringify({ name: data.name, message: connectedClients.size, eventType: data.eventType }));
        else client.send(JSON.stringify({ name: 'You', message: connectedClients.size,  eventType: data.eventType }));
        } else if(client !== socket ){
           client.send(JSON.stringify({ name: data.name, message: data.message, eventType: data.eventType }));
        }
      }
    });
  });

  socket.on('close', () => {
    console.log('Client has disconnected');
    connectedClients.delete(socket);
    // connectedClients.forEach((client) => {
    //   if (client.readyState === socket.OPEN) {
    //     client.send(JSON.stringify({ name: 'Server', message: connectedClients.size, eventType: 'connection' }));
    //   }
    // });
  });
});
app.use(express.static(path.join(__dirname, '.')));