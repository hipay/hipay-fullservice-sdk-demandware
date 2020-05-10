'use strict';

var HiPayOrderModule = require('*/cartridge/scripts/lib/hipay/HiPayOrderModule');

/** Verifies HiPay requests */
function verifyHash() {
    return HiPayOrderModule.hiPayVerifyRequest();
}

/**
* Place an Order after being paid with HiPay
*
* @param {dw.order.Order} order
*/
function proceedWithOrder(order) {
    var ISML = require('dw/template/ISML');
    var URLUtils = require('dw/web/URLUtils');
    var CSRFProtection = require('dw/web/CSRFProtection');
    var hiPayRedirectURL;

    hiPayRedirectURL = URLUtils.https('COPlaceOrder-Submit', 'order_id', order.orderNo, 'order_token', order.orderToken, CSRFProtection.getTokenName(), CSRFProtection.generateToken());
    ISML.renderTemplate('hipay/hosted/hipayredirect', {
        HiPayRedirectURL: hiPayRedirectURL
    });
}

/**
* Handles a fail order
*
* @param {Object} args - Current order and hiPayState
*/
function failOrder(args) {
    var order = args.order;
    var hiPayState = args.hiPayState;
    var Status = require('dw/system/Status');
    var Transaction = require('dw/system/Transaction');
    var URLUtils = require('dw/web/URLUtils');
    var OrderMgr = require('dw/order/OrderMgr');
    var ISML = require('dw/template/ISML');
    var hiPayRedirectURL;
    var status;

    if (order != null) {
        Transaction.wrap(function () {
            status = OrderMgr.failOrder(order, true);
        });
        if (status.status === Status.OK) {
            hiPayRedirectURL = URLUtils.https('COSummary-Start', 'status', hiPayState);
        }
    }

    hiPayRedirectURL = URLUtils.https('COSummary-Start');
    ISML.renderTemplate('hipay/hosted/hipayredirect', {
        HiPayRedirectURL: hiPayRedirectURL
    });
}

function failHungOrder(order) {
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/HiPayLogger');
    var log = new HiPayLogger('ClearHungOrders');
    try {
        require('dw/system/Transaction').wrap(function () {
            require('dw/order/OrderMgr').failOrder(order, true);
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
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/HiPayLogger');
    var Site = require('dw/system/Site');
    var Calendar = require('dw/util/Calendar');
    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');
    var log = new HiPayLogger('ClearHungOrders');
    var minutesBack = Site.getCurrent().getCustomPreferenceValue('hipayHungOrderTimeout');
    var startDate = new Calendar();

    startDate.setTimeZone(Site.current.getTimezone());
    startDate.add(Calendar.MINUTE, -minutesBack);

    try {
        OrderMgr.processOrders(failHungOrder, "status = {0} AND creationDate < {1}", Order.ORDER_STATUS_CREATED, startDate.getTime()); // eslint-disable-line
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
