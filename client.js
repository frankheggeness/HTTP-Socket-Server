'use strict';

const net = require('net');
let port = 80;

let args = process.argv;
let date = new Date();
let method = `GET`;

if (args[3]) {
  method = args[3];
}

if (!args[2]) {
  process.stdout.write('no argument, try request /index.html');
  process.exit();
}

let argument = args[2];
let findHTML = argument.indexOf('.com');
let findHost = argument.substring(0, findHTML + 4);
let newRequest = argument.substring(findHTML + 4, argument.length);

if (argument.indexOf('localhost') !== -1) {
  findHost = 'localhost';
  port = 8080;

  let findIndex = argument.indexOf('/');

  newRequest = argument.substring(findIndex, argument.length);
}

let request = `${method} ${newRequest} HTTP/1.1\r\n`;
request += `host: ${findHost}\r\n`;
request += `date: ${new Date().toUTCString()}\r\n`;
request += `\r\n`;

console.log(request);
console.log(findHost);

const client = net.createConnection(port, findHost, () => {
  client.setEncoding('utf-8');

  client.on('connect', () => {
    console.log('connected');
  });

  client.write(request);
});

client.on('data', (data) => {
  process.stdout.write(data);
});

client.on('end', () => {
  console.log('The connection has ended');
});

client.on('error', () => {
  console.log('CAUTION ERROR');
  process.exit();
});
