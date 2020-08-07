module.exports = {
    secret:
        process.env.SECRET ||
        'akopkeopqkmwopkeOPAKEOWPJAIOWjIOANMDIKOAJ123123asmdokn918293SASD',
    jwtExpiresAfter: 24 * 60 * 60 * 1000,
    cookieName: '_wab_auth_jwt',
    minify: true,
};
