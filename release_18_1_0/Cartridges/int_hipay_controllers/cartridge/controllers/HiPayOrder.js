'use strict';

var guard            = require('~/cartridge/scripts/guard'),
    HiPayOrderModule = require('~/cartridge/scripts/lib/hipay/HiPayOrderModule'),
    HiPayProcess     = require('~/cartridge/controllers/HiPayProcess');

/** Handles HiPay accepted payment */
function Accept() {
    var isHashValid = HiPayProcess.VerifyHash(),
        params      = {},
        processOrder,
        order,
        error;

    if (isHashValid) {
        processOrder = HiPayOrderModule.hiPayProcessOrderCall();
        order        = processOrder.order;
        error        = processOrder.error;
        params       = {
            order      : order,
            hiPayState : error
        };

        if (error) {
            HiPayProcess.FailOrder(params);
        } else {
            HiPayProcess.ProceedWithOrder(order);
        }
    } else {
        params = {
            order      : order,
            hiPayState : "error"
        };
        HiPayProcess.FailOrder(params);
    }
}

/** Handles HiPay pending payment */
function Pending() {
    Accept();
}

/** Handles HiPay declined payment */
function Decline(args) {
    var isHashValid = HiPayProcess.VerifyHash(),
        order       = args.order,
        hiPayState  = args.hiPayState,
        hiPayRedirectURL,
        result;

    if (hiPayState !== "cancel") {
        hiPayState = "decline";
    }

    if (!isHashValid) {
        hiPayRedirectURL = dw.web.URLUtils.https('Home-Show');
        ISML.renderTemplate('hipay/hosted/hipayredirect', {
            HiPayRedirectURL : hiPayRedirectURL
        });
    } else {
        var processOrder = HiPayOrderModule.hiPayProcessOrderCall();

        if (processOrder.error) {
            hiPayRedirectURL = dw.web.URLUtils.https('Home-Show');
            ISML.renderTemplate('hipay/hosted/hipayredirect', {
                HiPayRedirectURL : hiPayRedirectURL
            });
        } else {
            order  = processOrder.order;
            result = {
                order      : order,
                hiPayState : hiPayState
            };
            HiPayProcess.FailOrder(result);
        }
    }
}

/** Handles HiPay cancelled payment */
function Cancel(args) {
    args.hiPayState = "cancel";
    HiPayProcess.Decline(args);
}

/** Handles HiPay error payment response */
function Error() {
    var ISML = require('dw/template/ISML');
    ISML.renderTemplate('hipay/order/error');
}

/** @see {@link module:controllers/HiPayOrder~Accept} */
exports.Accept = guard.ensure(['https'], Accept);
/** @see {@link module:controllers/HiPayOrder~Pending} */
exports.Pending = guard.ensure(['https'], Pending);
/** @see {@link module:controllers/HiPayOrder~Decline} */
exports.Decline = guard.ensure(['https'], Decline);
/** @see {@link module:controllers/HiPayOrder~Cancel} */
exports.Cancel = guard.ensure(['https'], Cancel);
/** @see {@link module:controllers/HiPayOrder~Error} */
exports.Error = guard.ensure(['https'], Error);
