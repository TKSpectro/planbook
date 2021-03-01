// define our constants
const SocketHandler = require('./core/socket.js');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')();
const bodyParser = require('body-parser');
const database = require('./core/database.js')();
const favicon = require('serve-favicon');
const cron = require('node-cron');

//Attach socket.io
io.attach(server);

//Write global configuration
global.cfg = require('./config/config.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Define static content
app.use('/assets', express.static(__dirname + '/assets'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/apidoc', express.static(__dirname + '/docs'));

const socket = new SocketHandler(io, database);
app.ioHandler = socket;

//Set our custom router
const routes = require('./config/routes.js');
const Router = require('./core/router.js');
const router = new Router(app, routes, database);
router.setup();

// Cronjob
cron.schedule('0 6 * * *', () => {
    const url = process.env.URL + 'api/cron/bookRecurringPayments';
    const data = JSON.stringify({
        cron_password: process.env.CRON_PASSWORD,
    });
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
        },
    };

    const req = http.request(url, options, (res) => {
        res.on('data', (d) => {});
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
});

//Start the webserver
server.listen(process.env.PORT || 3000, function () {
    console.log('App started on Port ' + (process.env.PORT || 3000));
});
