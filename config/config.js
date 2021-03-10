require('dotenv').config();

module.exports = {
    secret:
        process.env.SECRET ||
        'akopkeopqkmwopkeOPAKEOWPJAIOWjIOANMDIKOAJ123123asmdokn918293SASD',
    jwtExpiresAfter:
        Number(String(process.env.JWT_EXPIRES_AFTER)) || 24 * 60 * 60 * 1000,
    cookieName: 'planbook_auth_jwt',
    minify: process.env.MINIFY == 'false' ? false : true,
};
