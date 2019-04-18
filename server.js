'use strict';
const net = require('net');

const dataFiles = require('./data.js');

const contentObj = dataFiles.contentObj;

console.log(contentObj[2]);
// this creates a server
const server = net
  .createServer((socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
      // this is the request

      // do work here

      let endIndex = data.indexOf(` HTTP/1.1`);
      let headValue = data.substring(5, endIndex);
      let myResponse = '';

      for (let i = 0; i < contentObj.length; i++) {
        if (headValue === contentObj[i].name) {
          myResponse = `HTTP/1.1 200 OK
        Content-Length: ${contentObj[i].content.length}
        
        ${contentObj[i].content}
        `;
        }
      }

      console.log('headValue :', headValue);

      // send response back here
      socket.end(myResponse);
    });
  })
  // handle errors on the server
  .on('error', (err) => {
    console.log(err);
  });

// this starts the server
server.listen(8080, () => {
  console.log('Server is UP');
});
