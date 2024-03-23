"use strict";

const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');
let localStream;
let pc;

startButton.onclick = startCall;
hangupButton.onclick = hangup;

async function startCall() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localStream = stream;
  document.getElementById('localVideo').srcObject = stream;

  const configuration = {};
  pc = new RTCPeerConnection(configuration);
  pc.addStream(localStream);

  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({ candidate: event.candidate });
    }
  };

  pc.onaddstream = event => {
    document.getElementById('remoteVideo').srcObject = event.stream;
  };

  // Start the call by sending an offer to the other peer
  pc.createOffer().then(offer => {
    return pc.setLocalDescription(offer);
  }).then(() => {
    // Send the offer to the other peer
    sendMessage({ offer: pc.localDescription });
  }).catch(handleError);
}

function hangup() {
  pc.close();
  pc = null;
  localStream.getTracks().forEach(track => track.stop());
  localStream = null;
}

function handleError(err) {
  console.error('Error: ', err);
}

function sendMessage(message) {
  // Here, you would send the message to the other peer using a signaling server
}
