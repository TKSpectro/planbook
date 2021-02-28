const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cfg = require('../config/config');

class Passport {
    static generatePassword(length = 18) {
        let hash = crypto.randomBytes(length).toString('hex');
        hash = hash.substring(0, length);
        return hash;
    }

    static hashPassword(str) {
        return bcrypt.hashSync(str, 10);
    }

    static comparePassword(str, hash) {
        return bcrypt.compareSync(str, hash);
    }

    static generateJwt(userId) {
        let payload = {
            iat: Date.now(),
            exp: Date.now() + cfg.jwtExpiresAfter,
            id: userId,
        };

        return jwt.sign(payload, cfg.secret);
    }

    static isAuthorized(req) {
        const self = this;
        let cookies = self.cookies(req);
        let token;
        if (cookies[cfg.cookieName]) {
            token = cookies[cfg.cookieName];
        } else if (req.headers && req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }
        if (token !== null && token !== 'null' && token !== undefined) {
            try {
                let payload = jwt.verify(token, cfg.secret);
                if (payload) {
                    if (payload.exp > Date.now()) {
                        return payload;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
        return false;
    }

    static authorizeUserWithCookie(req, res, userId) {
        const self = this;
        let token = self.generateJwt(userId);

        res.cookie(cfg.cookieName, token, {
            maxAge: cfg.jwtExpiresAfter,
            httpOnly: false,
            secure: req.secure,
        });

        return token;
    }

    static unauthorizeUser(req, res) {
        const self = this;

        res.clearCookie(cfg.cookieName);

        return;
    }

    static cookies(req) {
        let cookies = {};
        let _cookies = req.headers.cookie;

        if (_cookies) {
            _cookies = _cookies.split(';');

            let parts = null;

            for (let i = 0; i < _cookies.length; ++i) {
                parts = _cookies[i].split('=');
                cookies[parts[0].trim()] = parts[1];
            }
        }
        return cookies;
    }
}

module.exports = Passport;
