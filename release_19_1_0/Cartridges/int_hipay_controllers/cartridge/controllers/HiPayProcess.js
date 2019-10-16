'use strict';

var HiPayOrderModule = require('~/cartridge/scripts/lib/hipay/HiPayOrderModule');

/** Verifies HiPay requests */
function VerifyHash() {
    return HiPayOrderModule.hiPayVerifyRequest();
}

/**
* Place an Order after being paid with HiPay
*
* @param {dw.order.Order} order
*/
function ProceedWithOrder(order) {
    var ISML             = require('dw/template/ISML'),
        hiPayRedirectURL;
    
    hiPayRedirectURL = dw.web.URLUtils.https('COPlaceOrder-Submit', 'order_id', order.orderNo, 'order_token', order.orderToken, dw.web.CSRFProtection.getTokenName(), dw.web.CSRFProtection.generateToken());
    ISML.renderTemplate('hipay/hosted/hipayredirect', {
        HiPayRedirectURL : hiPayRedirectURL
    });
}

/**
* Handles a fail order
*
* @param {Object} args - Current order and hiPayState
*/
function FailOrder(args) {
    var order            = args.order,
        hiPayState       = args.hiPayState,
        Status           = require('dw/system/Status'),
        Transaction      = require('dw/system/Transaction'),
        ISML             = require('dw/template/ISML'),
        hiPayRedirectURL,
        status;

    if (order != null) {
        Transaction.wrap(function() {
            status = dw.order.OrderMgr.failOrder(order);
        });
        if (status.status === Status.OK) {
            hiPayRedirectURL = dw.web.URLUtils.https('COSummary-Start', 'status', hiPayState);
        }
    }

    hiPayRedirectURL = dw.web.URLUtils.https('COSummary-Start');
    ISML.renderTemplate('hipay/hosted/hipayredirect', {
        HiPayRedirectURL : hiPayRedirectURL
    });
}

/**
* This function fails all Orders that are in CREATED state.
* Such orders are considered hung in the system during the two step checkout.
*
*/
function ClearHungOrders() {
    var HiPayLogger = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        Site        = require('dw/system/Site'),
        Calendar    = require('dw/util/Calendar'),
        OrderMgr    = require('dw/order/OrderMgr'),
        Order       = require('dw/order/Order'),
        log         = new HiPayLogger("ClearHungOrders"),
        minutesBack = Site.getCurrent().getCustomPreferenceValue("hipayHungOrderTimeout"),
        startDate   = new Calendar();

    startDate.setTimeZone(Site.current.getTimezone());
    startDate.add(Calendar.MINUTE, -minutesBack);

    try {
        OrderMgr.processOrders(failHungOrder, "status = {0} AND creationDate < {1}", Order.ORDER_STATUS_CREATED, startDate.getTime());
    } catch (e) {
        var error = "Error while fetching hung orders ::: " + e.message;
        log.error(error);
    }
}

function failHungOrder(order) {
    try {
        require('dw/system/Transaction').wrap(function () {
            require('dw/order/OrderMgr').failOrder(order);
        });
    } catch (e) {
        var error = "Error while fail hung order ::: " + e.message;
        log.error(error);
    }
}

/** @see {@link module:controllers/HiPayProcess~VerifyHash} */
exports.VerifyHash = VerifyHash;
/** @see {@link module:controllers/HiPayProcess~ProceedWithOrder} */
exports.ProceedWithOrder = ProceedWithOrder;
/** @see {@link module:controllers/HiPayProcess~FailOrder} */
exports.FailOrder = FailOrder;
/** @see {@link module:controllers/HiPayOrder~ClearHungOrders} */
exports.ClearHungOrders = ClearHungOrders;
