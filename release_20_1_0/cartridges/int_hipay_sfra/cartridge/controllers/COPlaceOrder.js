'use strict';

var server = require('server');
var OrderMgr = require('dw/order/OrderMgr');
var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var BasketMgr = require('dw/order/BasketMgr');
var URLUtils = require('dw/web/URLUtils');
var hooksHelper = require('*/cartridge/scripts/helpers/hooks');

/**
 * Handle order submit and send the confirmation email.
 */
function submitOrder(orderId, req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var order = OrderMgr.getOrder(orderId);
    var fraudDetectionStatus = hooksHelper('app.fraud.detection', 'fraudDetection', currentBasket, require('*/cartridge/scripts/hooks/fraudDetection').fraudDetection);
    var Transaction = require('dw/system/Transaction');
    var Resource = require('dw/web/Resource');

    if (fraudDetectionStatus.status === 'fail') {
        Transaction.wrap(function () { OrderMgr.failOrder(order, true); });
        // fraud detection failed
        req.session.privacyCache.set('fraudDetectionStatus', true);
        res.json({
            error: true,
            cartError: true,
            redirectUrl: URLUtils.url('Error-ErrorCode', 'err', fraudDetectionStatus.errorCode).toString(),
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });

        return next();
    }

    // Place the order
    var placeOrderResult = COHelpers.placeOrder(order, fraudDetectionStatus);

    if (placeOrderResult.error) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });

        return next();
    } else if (!empty(req.querystring.paymentStatus)) {
        var hiPayStatus = req.querystring.paymentStatus;
        var message = '';

        if (hiPayStatus === 'cancel') {
            message = Resource.msg('hipay.payment.cancel', 'hipay', null);
        } else if (hiPayStatus === 'decline') {
            message = Resource.msg('hipay.payment.decline', 'hipay', null);
        } else if (hiPayStatus === 'error') {
            message = Resource.msg('hipay.payment.error', 'hipay', null);
        } else {
            message = Resource.msg('error.confirmation.error', 'confirmation', null);
        }

        res.redirect(URLUtils.https('Checkout-Begin', 'stage', 'payment', 'authMessage', message));

        return next();
    }

    COHelpers.sendConfirmationEmail(order, req.locale.id);

    // Reset usingMultiShip after successful Order placement
    req.session.privacyCache.set('usingMultiShipping', false);

    res.redirect(URLUtils.https('Order-Confirm', 'ID', order.orderNo, 'token', order.orderToken));


    return next();
}

server.use('Submit', csrfProtection.generateToken, function (req, res, next) {
    var order = OrderMgr.getOrder(req.querystring.order_id);

    if (order && req.querystring.order_token === order.getOrderToken()) {
        submitOrder(req.querystring.order_id, req, res, next);
    }

    return next();
});

module.exports = server.exports();
