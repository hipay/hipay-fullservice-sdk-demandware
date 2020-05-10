'use strict';

var guard = require('~/cartridge/scripts/guard');
var ISML = require('dw/template/ISML');
var URLUtils = require('dw/web/URLUtils');
var HiPayOrderModule = require('*/cartridge/scripts/lib/hipay/HiPayOrderModule');
var HiPayProcess = require('*/cartridge/controllers/HiPayProcess');

/** Handles HiPay accepted payment */
function Accept() {
    var isHashValid = HiPayProcess.verifyHash();
    var params = {};
    var processOrder;
    var order;
    var error;

    processOrder = HiPayOrderModule.hiPayProcessOrderCall();
    order = processOrder.order;
    error = processOrder.error;

    if (error) {
        if (order === undefined) {
            // Dans Cas Multibanco / Mbway / Sisal 
            var hiPayRedirectURL = URLUtils.https('Home-Show');
            ISML.renderTemplate('hipay/hosted/hipayredirect', {
                HiPayRedirectURL: hiPayRedirectURL
            });
        } else {
            params = {
                order: order,
                hiPayState: error
            };
            redirectURL = HiPayProcess.failOrder(params);
            res.redirect(redirectURL);
        }
    } else if (isHashValid) {
        HiPayProcess.proceedWithOrder(order);
    } else if (!isHashValid) {
        if (order) {             
            // SANS HashValid : Dans le Cas Multibanco / Mbway / Sisal
            var paymentMethod = order.paymentInstrument.paymentMethod;
            if (paymentMethod.equals('HIPAY_MULTIBANCO') || paymentMethod.equals('HIPAY_MBWAY')  || paymentMethod.equals('HIPAY_SISAL')) {                   
                HiPayProcess.proceedWithOrder(order);
            }            
        } else {
            params = {
                order: order,
                hiPayState: 'error'
            };            
            HiPayProcess.failOrder(params);
        }        
    }
}

/** Handles HiPay pending payment */
function Pending() {
    Accept(); // eslint-disable-line new-cap
}

/** Handles HiPay declined payment */
function Decline() {
    var URLUtils = require('dw/web/URLUtils');
    var isHashValid = HiPayProcess.verifyHash();
    var hiPayState = 'decline';
    var order;
    var hiPayRedirectURL;
    var result;

    if (!isHashValid) {
        hiPayRedirectURL = URLUtils.https('Home-Show');
        ISML.renderTemplate('hipay/hosted/hipayredirect', {
            HiPayRedirectURL: hiPayRedirectURL
        });
    } else {
        var processOrder = HiPayOrderModule.hiPayProcessOrderCall();

        if (processOrder.error) {
            hiPayRedirectURL = URLUtils.https('Home-Show');
            ISML.renderTemplate('hipay/hosted/hipayredirect', {
                HiPayRedirectURL: hiPayRedirectURL
            });
        } else {
            order = processOrder.order;
            result = {
                order: order,
                hiPayState: hiPayState
            };
            HiPayProcess.failOrder(result);
        }
    }
}

/** Handles HiPay cancelled payment */
function Cancel() {
    var URLUtils = require('dw/web/URLUtils');
    var isHashValid = HiPayProcess.verifyHash();
    var hiPayState = 'cancel';
    var order;
    var hiPayRedirectURL;
    var result;

    if (!isHashValid) {
        hiPayRedirectURL = URLUtils.https('Home-Show');
        ISML.renderTemplate('hipay/hosted/hipayredirect', {
            HiPayRedirectURL: hiPayRedirectURL
        });
    } else {
        var processOrder = HiPayOrderModule.hiPayProcessOrderCall();

        if (processOrder.error) {
            hiPayRedirectURL = URLUtils.https('Home-Show');
            ISML.renderTemplate('hipay/hosted/hipayredirect', {
                HiPayRedirectURL: hiPayRedirectURL
            });
        } else {
            order = processOrder.order;
            result = {
                order: order,
                hiPayState: hiPayState
            };
            HiPayProcess.failOrder(result);
        }
    }
}

/** Handles HiPay error payment response */
function Error() {
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
