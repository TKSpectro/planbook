const Passport = require('./passport.js');
const { Op, TableHints } = require('sequelize');

class SocketHandler {
    constructor(io, db) {
        const self = this;

        self.db = db;
        self.io = io;
        self.sockets = {};

        io.use((socket, next) => {
            let handshakeData = socket.handshake;
            let tokenPayload = Passport.isAuthorized(handshakeData);

            if (tokenPayload === false) {
                next(new Error('unauthorized'));
            } else {
                self.db.User.findOne({
                    where: {
                        id: tokenPayload.id,
                    },
                })
                    .then((user) => {
                        if (!user) {
                            next(new Error('unauthorized'));
                        } else {
                            socket.user = user;
                            next();
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        next(new Error('unauthorized'));
                    });
                //TODO: check if Payload is still valid (not expired)
            }
        });

        self.initEvents();
    }

    // um zu überprüfen ob der Nutzer online ist
    findUserSocketById(id) {
        let socket = null;
        for (let key in this.sockets) {
            socket = this.sockets[key];
            if (socket.user && socket.user.id === id) {
                return socket;
            }
        }

        return null;
    }

    initEvents() {
        const self = this;

        self.io.on('connection', (socket) => {
            console.log('new client connected', socket.id);
            self.sockets[socket.id] = socket;

            socket.on('disconnect', () => {
                console.log('disconnected client', socket.id);
                if (self.sockets[socket.id]) {
                    delete self.sockets[socket.id];
                }
            });
        });
    }
}

module.exports = SocketHandler;
