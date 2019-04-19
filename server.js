'use strict';

const file404 = require('./404.js');
const helium = require('./helium.js');
const index = require('./index.js');
const hydrogen = require('./hydrogen.js');
const styles = require('./styles.js');

const net = require('net');

let date = new Date();
let content = '';
let status = '200 OK';
const defaultStatus = '200 OK';

// this creates a server
const server = net
  .createServer((socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
      // this is the request
      console.log(data);

      // do work here

      let URI = data.slice(data.indexOf('/'), data.indexOf('HTTP') - 1);

      if (URI === '/index.html' || URI === '/') {
        content = index;
        status = defaultStatus;
      }
      if (URI === '/hydrogen.html') {
        content = hydrogen;
        status = defaultStatus;
      }
      if (URI === '/helium.html') {
        content = helium;
        status = defaultStatus;
      }
      if (URI === '/styles.css') {
        content = styles;
        status = defaultStatus;
      }
      if (URI === '/404.html') {
        content = file404;
        status = '404 File Not Found';
      }
      let response = `HTTP/1.1 ${status}
      Date: ${date}
Content-Length: ${content.length}

${content}
`;

      // send response back here
      socket.end(response);
    });
  })
  // handle errors on the server
  .on('error', (err) => {
    console.log(err);
  });

// this starts the serve
server.listen(8080, () => {
  console.log('Server is UP');
});
