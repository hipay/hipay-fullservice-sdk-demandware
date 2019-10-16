'use strict';

var server = require('server');

/**
 *  Load merchant CSS style for HiPay
 */
server.get(
    'Style',
    server.middleware.https,
    function (req, res, next) {
        res.render('hipay/hosted/hipayCss');

        next();
    }
);

module.exports = server.exports();
