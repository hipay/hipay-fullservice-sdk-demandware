'use strict';

/**
 * Extracts parameters from the call made from the HiPay hosted page
 *
 * @param  {dw.web.HttpParameterMap} httpParams
 * @return {String} hiPayPaymentStatus
 * @return {dw.order.Order} order
 *
 */
function hiPayProcessOrderCall() {
    var Order = require('dw/order/Order');
    var OrderMgr = require('dw/order/OrderMgr');
    var Transaction = require('dw/system/Transaction');
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/HiPayLogger');
    var HiPayHelper = require('*/cartridge/scripts/lib/hipay/HiPayHelper');
    var hipayUtils = require('*/cartridge/scripts/lib/hipay/HipayUtils');
    var log = new HiPayLogger('HiPayProcessOrderCall');
    var helper = new HiPayHelper();
    var params = request.httpParameterMap;
    var response = {};
    var orderid;
    var order;

    log.info('HiPay Order Call ' + params);

    if (params.isParameterSubmitted('orderid')) {
        orderid = hipayUtils.removeFromOrderId(params.orderid.stringValue);

        if (empty(orderid)) {
            log.error('The call from HiPay does not have a valid OrderNo!');
            response.error = true;
        } else {
            order = OrderMgr.getOrder(orderid);

            if (empty(order)) {
                log.error('The call from HiPay bares an OrderNo which is not valid! :: ' + orderid);
                response.error = true;
            }

            if (order.getStatus().value !== Order.ORDER_STATUS_CREATED) {
                log.error('The HiPay order has already been processed! Probably a second call is made with the same parameters :: ' + orderid);
                response.error = true;
            }

            response.order = order; // set the order if an error occurs further
        }
    } else {
        log.error('The call from HiPay does not have the orderid parameter!');
        response.error = true;
    }

    try {
        var state = params.state.stringValue; //= completed, declined
        var paymentInstr;
        var paymentTransaction;
        var reference;
        var pp;

        Transaction.wrap(function () {
            response.hiPayPaymentStatus = state; // completed, declined, pending
            paymentInstr = helper.getOrderPaymentInstrument(order);
            reference = params.reference.stringValue; // set the reference from hipay = 200628176332
            if(!empty(reference)){
                paymentTransaction = paymentInstr.getPaymentTransaction();
                paymentTransaction.setTransactionID(reference);
            }
            pp = params.pp.stringValue; // set transaction type = ideal,visa
            paymentInstr.custom.hipayTransactionType = pp;
            helper.updatePaymentStatus(order, paymentInstr, params); // update the payment status
            paymentInstr.custom.hipayTransactionState = state; // payment state

            if (state === 'declined') {
                paymentInstr.custom.hipayTransactionDeclineReason = params.reason; // 4000001
            }

            // process cards only
            if (params.isParameterSubmitted('cardtoken')) { // we assume the payment is done with a credit card
                // Fill payment info if not masked
                if (!paymentInstr.permanentlyMasked) {
                    var cardcountry = params.cardcountry; // US
                    var cardbrand = params.cardbrand.stringValue; // VISA
                    var cardexpiry = params.cardexpiry.stringValue; // 202202
                    var cardpan = params.cardpan.stringValue; // XXXXXXXXXXXX3333
                    var cardtoken = params.cardtoken.stringValue; // 347da03e9167a457279e99e540ee85559c666809
                    var year;
                    var month;

                    paymentInstr.custom.hipayCreditCardCountry = cardcountry;
                    paymentInstr.setCreditCardType(cardbrand);
                    paymentInstr.custom.hipayCreditCardType = cardbrand;

                    if (cardexpiry.length === 6) {
                        year = cardexpiry.substr(0, 4);
                        month = cardexpiry.substr(4, cardexpiry.length);

                        paymentInstr.setCreditCardExpirationMonth(Number(month));
                        paymentInstr.custom.hipayCreditCardExpirationMonth = month;
                        paymentInstr.setCreditCardExpirationYear(Number(year));
                        paymentInstr.custom.hipayCreditCardExpirationYear = year;
                    }

                    paymentInstr.setCreditCardNumber(cardpan);
                    paymentInstr.custom.hipayCreditCardNumber = cardpan;
                    paymentInstr.setCreditCardToken(cardtoken);
                    paymentInstr.custom.hipayCreditCardToken = cardtoken;
                }
            }
        });

        response.error = false;
    } catch (e) {
        log.error(e);
        response.error = true;
    }

    return response;
}

/** Executes HiPay signature verification using HiPaySignitureMgr */
function hiPayVerifyRequest() {
    var HiPayConfig = require('*/cartridge/scripts/lib/hipay/HiPayConfig').HiPayConfig;
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/HiPayLogger');
    var HiPaySignitureMgr = require('*/cartridge/scripts/lib/hipay/HiPaySignitureMgr').HiPaySignitureMgr;
    var log = new HiPayLogger('HiPayVerifyRequest');
    var isRequestValid;

    try {
        isRequestValid = HiPaySignitureMgr.checkIsValidResponse(request.getHttpParameters(), HiPayConfig.hipayApiPassphrase);

        if (!isRequestValid) {
            return false;
        }
    } catch (e) {
        log.error(e);
        return false;
    }

    return true;
}

/** @see {@link module:cartridge/scripts/lib/hipay/order/HiPayOrderModule~hiPayProcessOrderCall} */
exports.hiPayProcessOrderCall = hiPayProcessOrderCall;
/** @see {@link module:cartridge/scripts/lib/hipay/order/HiPayOrderModule~hiPayVerifyRequest} */
exports.hiPayVerifyRequest = hiPayVerifyRequest;
