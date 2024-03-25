const file = require('fs');
const path = require('path');
const geoip = require('geoip-lite');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
function visitorTrack(req, res, next){
    console.log('Visitor Tracking Middleware');
    const ip = req.ip;
    const geo = geoip.lookup(ip);
    const filePath = path.join(__dirname, 'visitors.json');
    const visitorId = uuidv4();
    const visitorData = {
        visitorId,
        time: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ip: req.ip.toString(),
        location: geo ? geo.city : 'Unknown'
    };
    let visitorString = JSON.stringify(visitorData);
    file.appendFile(filePath, visitorString + ',\n', (err) => {
        if(err){
            console.log(err);
        }
    }); 
    next();
}
module.exports = visitorTrack;