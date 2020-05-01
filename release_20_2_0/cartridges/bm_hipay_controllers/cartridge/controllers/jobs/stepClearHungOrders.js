/**
 * stepCleanSaveOneclick step-job module
 *
 * @module cartridge/controllers/jobs/stepCleanSaveOneclick
 */

'use strict';

/* Script Modules */
var Logger = require('dw/system/Logger').getLogger('Hipay-stepCleanClearHungOrders');
var Status = require('dw/system/Status');
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');

function failHungOrder(order) {
    var paymentMethod = order.paymentInstrument.paymentMethod;
    try {
        if (paymentMethod === 'HIPAY_MULTIBANCO' || paymentMethod === 'HIPAY_HOSTED_MULTIBANCO' 
        || paymentMethod === 'HIPAY_MBWAY' || paymentMethod === 'HIPAY_HOSTED_MBWAY'
        || paymentMethod === 'HIPAY_SISAL' || paymentMethod === 'HIPAY_HOSTED_SISAL') {
            Logger.info('\n[The order : {0} remains in the status CREATED, with payment method : {1} ]', order.orderNo, paymentMethod );
        } else {
            Transaction.wrap(function () {
                        OrderMgr.failOrder(order, true);
                    });
            Logger.warn('\n### Set status from CREATED to FAILED of order :  {0}, with payment method : {1} ###', order.orderNo, paymentMethod);
        }
        
    } catch (e) {
        Logger.error('[stepCleanClearHungOrders.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
        return new Status(Status.ERROR);
    }
}

/**
* This function fails all Orders that are in CREATED state (except for the modes of payment: Multibanco, Mbway, Sisal)
* Such orders are considered hung in the system during the two step checkout.
*
*/
function stepClearHungOrders() {
    Logger.info('step-job stepClearHungOrders : start of treatment');

    var Site = require('dw/system/Site');
    var Calendar = require('dw/util/Calendar');
    var Order = require('dw/order/Order');
    var minutesBack = Site.getCurrent().getCustomPreferenceValue('hipayHungOrderTimeout');
    var startDate = new Calendar();

    startDate.setTimeZone(Site.current.getTimezone());
    startDate.add(Calendar.MINUTE, -minutesBack);    
    
    try {  
        OrderMgr.processOrders(failHungOrder, "status = {0} AND creationDate < {1}", Order.ORDER_STATUS_CREATED, startDate.getTime()); 
    } catch (e) {
        Logger.error('[stepCleanClearHungOrders.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
        return new Status(Status.ERROR);
    }  

    Logger.info('step-job stepCleanClearHungOrders : end with OK');
    return new Status(Status.OK);
}

/* Exports of the modules */
/**
 * @see {@link modulecartridge/controllers/jobs/stepCleanSaveOneclick~StepCleanSaveOneclick} */
 exports.StepClearHungOrders = stepClearHungOrders;
