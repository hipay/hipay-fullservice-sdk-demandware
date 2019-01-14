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
    var Order                  = require('dw/order/Order'),
        OrderMgr               = require('dw/order/OrderMgr'),
        OrderPaymentInstrument = require('dw/order/OrderPaymentInstrument'),
        PaymentTransaction     = require('dw/order/PaymentTransaction'),
        Transaction            = require('dw/system/Transaction'),
        HiPayLogger            = require('~/cartridge/scripts/lib/hipay/HiPayLogger'),
        HiPayHelper            = require('~/cartridge/scripts/lib/hipay/HiPayHelper'),
        log                    = new HiPayLogger('HiPayProcessOrderCall'),
        helper                 = new HiPayHelper(),
        params                 = request.httpParameterMap,
        response               = {},
        orderid,
        order,
        orderToken,
        cdata1;

    log.info("HiPay Order Call \n" + params);

    if (params.isParameterSubmitted("orderid")) {
        orderid = params.orderid.stringValue; //=00000601

        if (empty(orderid)) {
            log.error("The call from HiPay does not have a valid OrderNo!");
            response.error = true;
        } else {
            order = OrderMgr.getOrder(orderid);

            if (empty(order)) {
                log.error("The call from HiPay bares an OrderNo which is not valid! :: " + orderid);
                response.error = true;
            }

            if (order.getStatus() != Order.ORDER_STATUS_CREATED) {
                log.error("The HiPay order has already been processed! Probably a second call is made with the same parameters :: " + orderid);
                response.error = true;
            }
            
            //removed via email request
            //orderToken = order.getOrderToken();
            //cdata1 = params.cdata1.stringValue;

            //if (orderToken !== cdata1) {
            //    log.error("The HiPay order token does not match the one sent in the hosted page request! :: " + orderid);
            //    response.error = true;
            //}

            response.order = order; //set the order if an error occurs further
        }
    } else {
        log.error("The call from HiPay does not have the orderid parameter!");
        response.error = true;
    }

    try {
        var cid                = params.cid.stringValue, //=bcsay8LSrmfuN9X7gEMiQeDd5x
            state              = params.state.stringValue, //=completed, declined
            test               = params.test.intValue, //=1
            approval           = params.approval.stringValue, //=0000000000
            authorized         = params.authorized.stringValue, //=2015-06-02T20%3A23%3A40%2B0000
            ip                 = params.ip.stringValue, //=84.238.197.207
            country            = params.country.stringValue, //=BG
            lang               = params.lang.stringValue, //=en+++
            email              = params.email.stringValue, //=kiril%40forkpoint.com
            score              = params.score.intValue, //=0
            fraud              = params.fraud.stringValue, //=accepted
            review             = params.review,
            avscheck           = params.avscheck,
            cvccheck           = params.cvccheck,
            eci3ds             = params.eci3ds,
            veres              = params.veres,
            pares              = params.pares,
            paymentInstr,
            paymentTransaction,
            reference,
            pp;

        Transaction.wrap(function() {
            response.hiPayPaymentStatus               = state; // completed, declined, pending
            paymentInstr                              = helper.getOrderPaymentInstrument(order),
            paymentTransaction                        = paymentInstr.getPaymentTransaction(),
            reference                                 = params.reference.stringValue; //set the reference from hipay = 200628176332
            paymentTransaction.setTransactionID(reference);
            pp                                        = params.pp.stringValue; //set transaction type = ideal,visa
            paymentInstr.custom.hipayTransactionType  = pp;
            helper.updatePaymentStatus(order, paymentInstr, params); //update the payment status
            paymentInstr.custom.hipayTransactionState = state; //payment state

            if (state == "declined") {
                paymentInstr.custom.hipayTransactionDeclineReason = params.reason; // 4000001
            }

            // process cards only
            if (params.isParameterSubmitted("cardtoken")) { //we assume the payment is done with a credit card
                //Fill payment info if not masked
                if (!paymentInstr.permanentlyMasked) {
                    var cardcountry = params.cardcountry, //US
                        cardbrand   = params.cardbrand.stringValue, //VISA
                        cardexpiry  = params.cardexpiry.stringValue, // 202202
                        cardpan     = params.cardpan.stringValue, //XXXXXXXXXXXX3333
                        cardtoken   = params.cardtoken.stringValue, //347da03e9167a457279e99e540ee85559c666809
                        year,
                        month;

                    paymentInstr.custom.hipayCreditCardCountry = cardcountry;
                    paymentInstr.setCreditCardType(cardbrand);
                    paymentInstr.custom.hipayCreditCardType = cardbrand;

                    if (cardexpiry.length == 6) {
                        year  = cardexpiry.substr(0, 4);
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
    var HiPayConfig       = require('~/cartridge/scripts/lib/hipay/HiPayConfig').HiPayConfig,
        HiPayLogger       = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        HiPaySignitureMgr = require('~/cartridge/scripts/lib/hipay/HiPaySignitureMgr').HiPaySignitureMgr,
        log               = new HiPayLogger("HiPayVerifyRequest"),
        isRequestValid;

    try {
        isRequestValid = HiPaySignitureMgr.checkIsValidResponse(request.getHttpParameters(), HiPayConfig.hipayApiPassphrase);

        if (!isRequestValid) {
            return false;
        }
    } catch(e) {
        log.error(e);
        return false;
    }

    return true;
}

/** @see {@link module:cartridge/scripts/lib/hipay/order/HiPayOrderModule~hiPayProcessOrderCall} */
exports.hiPayProcessOrderCall = hiPayProcessOrderCall;
/** @see {@link module:cartridge/scripts/lib/hipay/order/HiPayOrderModule~hiPayVerifyRequest} */
exports.hiPayVerifyRequest = hiPayVerifyRequest;
