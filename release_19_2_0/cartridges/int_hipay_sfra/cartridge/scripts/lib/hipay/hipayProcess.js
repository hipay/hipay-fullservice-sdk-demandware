'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');
var HiPayOrderModule = require('*/cartridge/scripts/lib/hipay/modules/hipayOrderModule');

// Verifies HiPay requests
function verifyHash() {
    return HiPayOrderModule.hiPayVerifyRequest();
}

/**
* Place an Order after being paid with HiPay
*
* @param {dw.order.Order} order
*/
function proceedWithOrder(order, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var CSRFProtection = require('dw/web/CSRFProtection');

    var hiPayRedirectURL = URLUtils.https('COPlaceOrder-Submit', 'order_id', order.orderNo, 'order_token', order.orderToken, CSRFProtection.getTokenName(), CSRFProtection.generateToken());

    res.redirect(hiPayRedirectURL);
    next();
}

/**
* Handles a fail order
*
* @param {Object} args - Current order and hiPayState
*/
function failOrder(args) {
    var URLUtils = require('dw/web/URLUtils');
    var CSRFProtection = require('dw/web/CSRFProtection');
    var Status = require('dw/system/Status');
    var order = args.order;
    var hiPayState = args.hiPayState;
    var hiPayRedirectURL;
    var status;

    if (order != null) {
        Transaction.wrap(function () {
            status = OrderMgr.failOrder(order, true);
        });
        if (status.status === Status.OK) {
            hiPayRedirectURL = URLUtils.https('COPlaceOrder-Submit', 'order_token', order.orderToken, 'order_id', order.orderNo, 'paymentStatus', hiPayState, CSRFProtection.getTokenName(), CSRFProtection.generateToken());
        }
    }

    return hiPayRedirectURL;
}

function failHungOrder(order) {
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/hipayLogger');
    var log = new HiPayLogger('ClearHungOrders');

    try {
        Transaction.wrap(function () {
            OrderMgr.failOrder(order, true);
        });
    } catch (e) {
        var error = 'Error while fail hung order ::: ' + e.message;
        log.error(error);
    }
}

/**
* This function fails all Orders that are in CREATED state.
* Such orders are considered hung in the system during the two step checkout.
*
*/
function ClearHungOrders() {
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/hipayLogger');
    var Site = require('dw/system/Site');
    var Calendar = require('dw/util/Calendar');
    var Order = require('dw/order/Order');
    var log = new HiPayLogger('ClearHungOrders');
    var minutesBack = Site.getCurrent().getCustomPreferenceValue('hipayHungOrderTimeout');
    var startDate = new Calendar();

    startDate.setTimeZone(Site.current.getTimezone());
    startDate.add(Calendar.MINUTE, -minutesBack);

    try {
        OrderMgr.processOrders(failHungOrder, "status = {0} AND creationDate < {1}", Order.ORDER_STATUS_CREATED, startDate.getTime()); // eslint-disable-line quotes
    } catch (e) {
        var error = 'Error while fetching hung orders ::: ' + e.message;
        log.error(error);
    }
}

/** @see {@link module:controllers/HiPayProcess~VerifyHash} */
exports.verifyHash = verifyHash;
/** @see {@link module:controllers/HiPayProcess~ProceedWithOrder} */
exports.proceedWithOrder = proceedWithOrder;
/** @see {@link module:controllers/HiPayProcess~FailOrder} */
exports.failOrder = failOrder;
/** @see {@link module:controllers/HiPayOrder~ClearHungOrders} */
exports.ClearHungOrders = ClearHungOrders;
