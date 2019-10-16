'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var OrderMgr = require('dw/order/OrderMgr');

var HiPayOrderModule = require('*/cartridge/scripts/lib/hipay/modules/hipayOrderModule');
var HiPayProcess = require('*/cartridge/scripts/lib/hipay/hipayProcess');

function acceptPayment(res, next) {
    var isHashValid = HiPayProcess.verifyHash();
    var params = {};
    var processOrder;
    var order;
    var error;
    var redirectURL;

    if (isHashValid) {
        processOrder = HiPayOrderModule.hiPayProcessOrderCall();
        order = processOrder.order;
        error = processOrder.error;
        params = {
            order: order,
            hiPayState: error
        };

        if (error) {
            redirectURL = HiPayProcess.failOrder(params);
            res.redirect(redirectURL);
        } else {
            HiPayProcess.proceedWithOrder(order, res, next);
        }
    } else {
        params = {
            order: order,
            hiPayState: 'error'
        };
        redirectURL = HiPayProcess.failOrder(params);
        res.redirect(redirectURL);
    }

    return next();
}

function declinePayment(req, res, next) {
    var isHashValid = HiPayProcess.verifyHash();
    var order = OrderMgr.getOrder(req.querystring.orderid);
    var hiPayState = req.querystring.state;
    var result;

    if (hiPayState !== 'cancel') {
        hiPayState = 'decline';
    }

    if (!isHashValid) {
        res.redirect(URLUtils.url('Home-Show'));
    } else {
        var processOrder = HiPayOrderModule.hiPayProcessOrderCall();

        if (processOrder.error) {
            res.redirect(URLUtils.url('Home-Show'));
        } else {
            order = processOrder.order;
            result = {
                order: order,
                hiPayState: hiPayState
            };

            var redirectURL = HiPayProcess.failOrder(result);
            res.redirect(redirectURL);
        }
    }

    return next();
}

/** Handles HiPay accepted payment */
server.get(
    'Accept',
    server.middleware.https,
    function (req, res, next) {
        acceptPayment(res, next);
    }
);

/** Handles HiPay pending payment */
server.get(
    'Pending',
    server.middleware.https,
    function (req, res, next) {
        acceptPayment(res, next);
    }
);

/** Handles HiPay declined payment */
server.get(
    'Decline',
    server.middleware.https,
    function (req, res, next) {
        declinePayment(req, res, next);
    }
);

/** Handles HiPay cancelled payment */
server.get(
    'Cancel',
    server.middleware.https,
    function (req, res, next) {
        declinePayment(req, res, next);
    }
);

/** Handles HiPay error payment response */
server.get(
    'Error',
    server.middleware.https,
    function (req, res, next) {
        res.render('hipay/order/error');

        return next();
    }
);

module.exports = server.exports();
