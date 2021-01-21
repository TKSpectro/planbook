// define our constants
const SocketHandler = require('./core/socket.js');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')();
const bodyParser = require('body-parser');
const database = require('./core/database.js')();
const favicon = require('serve-favicon');

//Attach socket.io
io.attach(http);

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

//Start the webserver
http.listen(process.env.PORT || 3000, function () {
    console.log('App started on Port ' + (process.env.PORT || 3000));
});
