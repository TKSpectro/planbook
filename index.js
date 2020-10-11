// define our constants
const SocketHandler = require('./core/socket.js');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')();
const bodyParser = require('body-parser');
const database = require('./core/database.js')();
const favicon = require('serve-favicon');

// attach socket.io
io.attach(http);

// write global configuration
global.cfg = require('./config/config.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// define static content
app.use('/assets', express.static('assets'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/apidoc', express.static(__dirname + '/docs'));

const socket = new SocketHandler(io, database);
app.ioHandler = socket;

// set our custom router
const routes = require('./config/routes.js');
const Router = require('./core/router.js');
const router = new Router(app, routes, database);
router.setup();

// start
http.listen(process.env.PORT || 3000, function () {
    console.log('App started on Port ' + (process.env.PORT || 3000));
});
