'use strict';

const fs = require('fs');
const net = require('net');
let port = 80;

let args = process.argv;

let method = `GET`;
let headerRequest = false;
let headerObj = {};
let saveResponse = false;
let fileName;

if (args[3] === 'GET' || args[3] === 'POST') {
  method = args[3];
}

if (args[3] === '-save' || args[4] === '-save' || args[5] === '-save') {
  saveResponse = true;
}

if (saveResponse) {
  let saveIndex = args.indexOf('-save');
  fileName = args[saveIndex + 1];
}
if (!args[2]) {
  console.log(`\n\tPlease specify a host/uri after "node client.js"\n`);
  console.log(`\tYou can request localhost using "localhost/[uri]", for example "localhost/helium.html"`);
  console.log(`\tTyping only "localhost/" will request to "localhost/index.html"\n`);
  console.log(`\tYou can request outside of local using [webAddress]/[uri]`);
  console.log(`\tFor example: "espn.com/", or "manoabbq.com/PartyPack.html"\n`);
  console.log(`\tYou can also add a fourth argument to determine the method used.`);
  console.log(`\tFor example: "node client.js devleague.com/ GET" or "node client.js manoabbq.com/ POST"\n`);
  console.log(`\tYou can also add a fifth argument '-h' in order to only grab the header.`);
  console.log(`\tFor example: "node client.js devleague.com/ GET -h"\n`);
  console.log(`\tFinally you can choose to save the server response as a file. File name must come after '-save'`);
  console.log(`\tTry: "node client.js devleague.com/ -save *fileName*"\n`);
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

if (args[4] === '-h' || args[3] === '-h') {
  headerRequest = true;
}

const client = net.createConnection(port, findHost, () => {
  client.setEncoding('utf-8');

  client.on('connect', () => {
    console.log('connected');
  });

  client.write(request);
});
if (headerRequest) {
  client.on('data', (data) => {
    let endHeader = data.indexOf('\r\n\r\n');

    let headerOnly = data.slice(data[0], endHeader);
    headerObj[findHost] = headerOnly;
    console.log(headerObj);

    process.stdout.write(`${headerOnly}`);
  });
} else {
  client.on('data', (data) => {
    process.stdout.write(data);
    if (saveResponse) {
      fs.writeFile(fileName, data, function(err) {
        if (err) {
          return console.log(err);
        }

        console.log('The file was saved!');
      });
    }
  });
}

client.on('end', () => {
  console.log('The connection has ended');
});

client.on('error', () => {
  console.log('CAUTION ERROR');
  process.exit();
});
