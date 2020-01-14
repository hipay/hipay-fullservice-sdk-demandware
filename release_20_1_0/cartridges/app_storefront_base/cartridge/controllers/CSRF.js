'use strict';

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.get('Fail', function (req, res, next) {
    res.render('/csrfFail');
    next();
});

server.get('AjaxFail', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    res.setStatusCode(500);
    res.json({ csrfError: true, redirectUrl: URLUtils.url('CSRF-Fail').toString() });
    next();
});

server.post('Generate', csrfProtection.generateToken, function (req, res, next) {
    res.json();
    next();
});

module.exports = server.exports();
