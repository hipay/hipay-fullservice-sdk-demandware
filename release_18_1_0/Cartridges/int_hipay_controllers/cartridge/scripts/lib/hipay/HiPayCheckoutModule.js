'use strict';

/**
* Auxiliary functions of the HiPay integration cartridge
*
* @module cartridge/scripts/lib/hipay/HiPayCheckoutModule
*/

var HiPayCheckoutModule = function () {};

/**
* Creates a payment instrument for the given basket. If any error occurs the module returns
* null with no payment instrument being created. If the creation succeeded
* the script returns the newly created payment instrument.
*
* @param  {dw.order.Basket} basket - The current basket
* @param  {String} paymentType - The payment method
* @param  {Boolean} removeExisting - True to remove existing credit cards from the basket
* @return {dw.order.PaymentInstrument} The created payment instrument
*/
HiPayCheckoutModule.createPaymentInstrument = function(basket, paymentType, removeExisting) {
    var amount       = null,
        paymentInstr = null,
        Transaction  = require('dw/system/Transaction');

    // verify that we have a basket and a valid credit card form
    if (basket == null || paymentType == null || removeExisting == null) {
        return null; // no payment instrument is returned
    }

    // remove existing credit cards from the basket
    if (removeExisting) {
        HiPayCheckoutModule.removeExistingPaymentInstruments(basket, paymentType);
    }

    amount       = HiPayCheckoutModule.calculateNonGiftCertificateAmount(basket); // calculate the amount to be charged for the credit card
    paymentInstr = Transaction.wrap(function () {
        return basket.createPaymentInstrument(paymentType, amount);
    }); // create a payment instrument for this credit card

    return paymentInstr;
}

/**
* Checks witch HIPAY Payment method is present and sets additional payment names.
*
* @param {dw.order.PaymentInstrument} paymentInstrument
*
*/
HiPayCheckoutModule.hiPayUpdatePaymentInstrument = function(paymentInstrument) {
    var PaymentMgr    = require('dw/order/PaymentMgr'),
        Transaction   = require('dw/system/Transaction'),
        paymentMethod = null, //the payment method
        pi            = paymentInstrument,
        ccType, //credit card type
        card; //payment card

    if (pi.paymentMethod.equals("HIPAY_CREDIT_CARD")) {
        ccType = session.forms.billing.paymentMethods.creditCard.type.value;
        card   = PaymentMgr.getPaymentCard(ccType);
        Transaction.wrap(function() {
            pi.custom.hipayProductName = card.custom.hipayProductName;
        });
    } else {
        paymentMethod = PaymentMgr.getPaymentMethod(pi.paymentMethod);
        Transaction.wrap(function() {
            pi.custom.hipayProductName         = paymentMethod.custom.hipayProductName;
            pi.custom.hipayPaymentProductList  = paymentMethod.custom.hipayPaymentProductList;
            pi.custom.hipayPaymentCategoryList = paymentMethod.custom.hipayPaymentCategoryList;
        });

        if (pi.paymentMethod.equals("HIPAY_IDEAL")) {
            Transaction.wrap(function() {
                pi.custom.hipayIdealBankID = session.forms.billing.paymentMethods.hipaymethods.issuer_bank_id.value;
            });
        }
    }
}

/**
* Make a call to HiPay to generate a token for the Credit Card payment using the information provided
*
* @param  {String} hiPayCardBrand
* @param  {String} hiPayCardNumber
* @param  {Number} hiPayCardExpiryMonth
* @param  {Number} hiPayCardExpiryYear
* @param  {String} hiPayCardHolder
* @param  {String} hiPayCardCVC
* @param  {Boolean} hiPayMultiUseToken
*
* @return {String} the hiPayToken if successful, null otherwise
*/
HiPayCheckoutModule.hiPayGenerateToken = function(hiPayCardBrand, hiPayCardNumber, hiPayCardExpiryMonth,
    hiPayCardExpiryYear, hiPayCardHolder, hiPayCardCVC, hiPayMultiUseToken) {
    var HiPayTokenService = require("~/cartridge/scripts/lib/hipay/services/HiPayTokenService"),
        HiPayLogger       = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        log               = new HiPayLogger("HiPayGenerateToken"),
        hiPayTokenService = new HiPayTokenService(),
        params            = {},
        month,
        multiUse,
        hipayResponse,
        token,
        msg,
        pan;

    params.card_brand        = hiPayCardBrand;
    params.card_number       = hiPayCardNumber;
    month                    = hiPayCardExpiryMonth;
    params.card_expiry_month = month < 10? "0" + month : month;
    params.card_expiry_year  = hiPayCardExpiryYear;
    params.card_holder       = hiPayCardHolder;
    params.cvc               = hiPayCardCVC;
    multiUse                 = hiPayMultiUseToken;
    params.multi_use         = multiUse ? 1 : 0;
    hipayResponse            = hiPayTokenService.generateToken(params);

    if (hipayResponse.ok === true) {
        try {
            msg = JSON.parse(hipayResponse.object.text);
        } catch (e) {
            log.error("Response text cannot be parsed as JSON ::: \n" + JSON.stringify(hipayResponse.object.text, undefined, 2));
            return { error : true };
        }

        token = msg.token;
        pan   = msg.pan;
    } else {
        log.error(hipayResponse.msg);
        return { error : true };
    }

    log.info(JSON.stringify(msg, undefined, 2));

    return {
        error      : false,
        HiPayToken : token,
        HiPayPan : pan
    };
}

/**
 * Invalidates the payment card form element in case specified status is ERROR.
 * If status is undefined or form is invalid the pipelet returns ERROR.
 *
 * @param  {dw.system.Status} status - Credit card status.
 * @param  {CreditCardForm} creditCardForm - The credit card form.
 * @return {Object} success if the payment card for is invalidated or error otherwise
 */
HiPayCheckoutModule.invalidatePaymentCardFormElements = function(status, creditCardForm) {
    var Status             = require('dw/system/Status'),
        PaymentStatusCodes = require('dw/order/PaymentStatusCodes'),
        Money              = require('dw/value/Money'),
        items;

    // verify that we have a status object and a valid credit card form
    if (status == null || !creditCardForm.valid) {
        return { error : true };
    }

    // we are fine, if status is OK
    if (status.status == Status.OK) {
        return { success : true };
    }

    // invalidate the payment card form elements
    items = status.items.iterator();

    while (items.hasNext()) {
        var item = items.next();

        switch (item.code) {
            case PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER:
                creditCardForm.number.invalidateFormElement();
                continue;

            case PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE:
                creditCardForm.expiration.month.invalidateFormElement();
                creditCardForm.expiration.year.invalidateFormElement();
                continue;

            case PaymentStatusCodes.CREDITCARD_INVALID_SECURITY_CODE:
                creditCardForm.cvn.invalidateFormElement();
        }
    }

    return { success : true };
}

/**
 * Determines if the basket already contains a credit card payment
 * instrument and removes it from the basket.
 *
 * @param {dw.order.Basket} basket
 * @param {String} paymentType - The type of the payment instrument
 *
 */
HiPayCheckoutModule.removeExistingPaymentInstruments = function(basket, paymentType) {
    // get all credit card payment instruments
    var ccPaymentInstrs = basket.getPaymentInstruments(paymentType),
        iter            = ccPaymentInstrs.iterator(),
        Transaction     = require('dw/system/Transaction'),
        existingPI;

    // remove them
    while (iter.hasNext()) {
        existingPI = iter.next();
        Transaction.wrap(function () {
            basket.removePaymentInstrument(existingPI);
        });
    }
}

/**
 * Calculates the amount to be payed by a non-gift certificate payment instrument based
 * on the given basket. The method subtracts the amount of all redeemed gift certificates
 * from the order total and returns this value.
 *
 * @param {dw.order.Basket} basket
 *
 */
HiPayCheckoutModule.calculateNonGiftCertificateAmount = function(basket) {
    var Money           = require('dw/value/Money'),
        giftCertTotal   = new Money(0.0, basket.currencyCode), // the total redemption amount of all gift certificate payment instruments in the basket
        gcPaymentInstrs = basket.getGiftCertificatePaymentInstruments(), // get the list of all gift certificate payment instruments
        iter            = gcPaymentInstrs.iterator(),
        orderPI,
        orderTotal,
        amountOpen;

    // sum the total redemption amount
    while (iter.hasNext()) {
        orderPI       = iter.next();
        giftCertTotal = giftCertTotal.add(orderPI.getPaymentTransaction().getAmount());
    }

    // get the order total
    orderTotal = basket.totalGrossPrice;

    // calculate the amount to charge for the payment instrument
    // this is the remaining open order total which has to be paid
    amountOpen = orderTotal.subtract(giftCertTotal);

    // return the open amount
    return amountOpen;
}

/**
 * Calls the /rest/v1/order Fullservice API endpoint and creates an Order
 * Used in case of Credit Card and all other HiPay payment types
 *
 * @param  {dw.order.PaymentInstrument} paymentInstrument
 * @param  {dw.order.Order} order
 * @param  {String} deviceFingerprint
 *
 * @return {String} - HiPay Redirect URL
 * @return {String} - HiPay Payment Status
 *
 */
HiPayCheckoutModule.hiPayOrderRequest = function(paymentInstrument, order, deviceFingerprint, recurring) {
    var Order              = require('dw/order/Order'),
        PaymentTransaction = require('dw/order/PaymentTransaction'),
        PaymentInstrument  = require('dw/order/PaymentInstrument'),
        Transaction        = require('dw/system/Transaction'),
        HiPayOrderService  = require("~/cartridge/scripts/lib/hipay/services/HiPayOrderService"),
        HiPayLogger        = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        HiPayHelper        = require("~/cartridge/scripts/lib/hipay/HiPayHelper"),
        HiPayConfig        = require('~/cartridge/scripts/lib/hipay/HiPayConfig').HiPayConfig,
        status             = require('~/cartridge/scripts/lib/hipay/HiPayStatus').HiPayStatus,
        log                = new HiPayLogger("HiPayOrderRequest"),
        hiPayOrderService  = new HiPayOrderService(),
        helper             = new HiPayHelper(),
        pi                 = paymentInstrument,
        fingeprint         = deviceFingerprint,
        hiPayPaymentStatus = status.DECLINED.code, //use decline if the processing fails, and set the appropriate status afterwards
        params             = {},
        response           = {
            hiPayPaymentStatus : null,
            hiPayRedirectURL   : null,
            error              : true
        },
        hipayResponse,
        responseMsg,
        paymentState,
        paymentTransaction;

    try {
        params.operation = HiPayConfig.hipayPaymentAction;

        if (pi.paymentMethod.equals("HIPAY_CREDIT_CARD")) {
            //credit card payment only
            params.cardtoken = pi.creditCardToken;
        }

        if (pi.paymentMethod.equals("HIPAY_IDEAL")) {
            params.issuer_bank_id = pi.custom.hipayIdealBankID;
        }

        params.payment_product    = pi.custom.hipayProductName;
        params.eci                = recurring ? 9 : 7;
        params.device_fingerprint = fingeprint;
        params.cdata1             = order.getOrderToken();
        helper.fillHeaderData(HiPayConfig, order, params); //fill in the common params
        helper.fillOrderData(order, params); //add order details
        log.info("HiPay Order Request  ::: \n" + JSON.stringify(params, undefined, 2));
        hipayResponse             = hiPayOrderService.loadOrderPayment(params);

        if (hipayResponse.ok === true) {
            responseMsg        = JSON.parse(hipayResponse.object.text);
            log.info("HiPay Order Response ::: \n" + JSON.stringify(responseMsg, undefined, 2));
            paymentTransaction = pi.getPaymentTransaction();

            Transaction.wrap(function() {
                paymentTransaction.setTransactionID(responseMsg.transactionReference); //set the reference from hipay
                pi.custom.hipayTransactionType = responseMsg.paymentProduct; //set transaction type = ideal,visa;
                helper.updatePaymentStatus(order, pi, responseMsg); //update the payment status
                paymentState = responseMsg.state;
                pi.custom.hipayTransactionState = paymentState;
            });

            // process cards only
            if (!empty(responseMsg.paymentMethod)) {
                Transaction.wrap(function() {
                    pi.custom.hipayCreditCardToken           = responseMsg.paymentMethod.token;
                    pi.custom.hipayCreditCardType            = responseMsg.paymentMethod.brand;
                    pi.custom.hipayCreditCardNumber          = responseMsg.paymentMethod.pan;
                    pi.custom.hipayCreditCardExpirationMonth = responseMsg.paymentMethod.cardExpiryMonth;
                    pi.custom.hipayCreditCardExpirationYear  = responseMsg.paymentMethod.cardExpiryYear;
                    pi.custom.hipayCreditCardIssuer          = responseMsg.paymentMethod.issuer;
                    pi.custom.hipayCreditCardCountry         = responseMsg.paymentMethod.country;
                });
            }

            response.hiPayPaymentStatus = paymentState; //set the status

            switch (paymentState) {
                case status.COMPLETED.code:
                    response.error = false;
                    return response;

                case status.PENDING.code:
                    response.error = false;
                    return response;

                case status.FORWARDING.code:
                    response.error            = false;
                    response.hiPayRedirectURL = responseMsg.forwardUrl
                    return response;

                case status.DECLINED.code:
                    response.error = true;
                    Transaction.wrap(function() {
                        pi.custom.hipayTransactionDeclineReason = responseMsg.reason.code + " : " + responseMsg.reason.message;
                    });
                    break;

                case status.ERROR.code:
                    response.error = true;
                    break;

                default:
                    response.error = true;
                    log.error("Unknown response HiPay payment status, this should not happen ::: " + hipayResponse.responseMsg);
            }
        } else {
            response.error = true;
            log.debug("HiPay Order Response : Error ::: \n" + JSON.stringify(hipayResponse, undefined, 2));
            log.error(hipayResponse);
        }
    } catch (e) {
        response.error = true;
        log.error(e);
    }

    response.error = true;
    return response;
}

/**
 * Initiates HiPay hosted page call as builds all the request parameters and
 * handles the returned URL.
 *
 *   @param {dw.order.PaymentInstrument} PaymentInstrument
 *   @param {dw.order.Order} Order
 *
 *   @returns {Object}  response
 *            {Boolean} response.error
 *            {String}  response.hiPayRedirectURL Returned hosted/iframe URL
 *            {Boolean} response.hiPayIFrameEnabled True If iFrame enabled False otherwise
 */

HiPayCheckoutModule.hiPayHostedPageRequest = function(order, paymentInstrument) {
    return dw.system.Transaction.wrap(function() {
        var Site               = require('dw/system/Site'),
            URLUtils           = require('dw/web/URLUtils'),
            Order              = require('dw/order/Order'),
            HiPayHostedService = require("~/cartridge/scripts/lib/hipay/services/HiPayHostedService"),
            HiPayLogger        = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
            HiPayHelper        = require("~/cartridge/scripts/lib/hipay/HiPayHelper"),
            HiPayConfig        = require('~/cartridge/scripts/lib/hipay/HiPayConfig').HiPayConfig,
            log                = new HiPayLogger("HiPayHostedPageRequest"),
            hiPayHostedService = new HiPayHostedService(),
            helper             = new HiPayHelper(),
            pi                 = paymentInstrument,
            httpHeaders        = request.httpHeaders.get('accept'),
            response           = {
                hiPayRedirectURL   : null,
                hiPayIFrameEnabled : null,
                error              : true
            };

            try {
                var params                   = {};
                params.operation             = HiPayConfig.hipayPaymentAction;
                params.eci                   = 7;
                params.css                   = URLUtils.https("HiPayResource-Style").toString();
                params.template              = HiPayConfig.getTemplateType();
                params.merchant_display_name = Site.current.getName();
                params.display_selector      = HiPayConfig.hipayDisplayCardSelector ? 1 : 0;
                params.multi_use             = 1;
                params.cdata1                = order.getOrderToken();

                if (!empty(pi.custom.hipayPaymentProductList)) {
                    params.payment_product_list = pi.custom.hipayPaymentProductList;
                }

                if (!empty(pi.custom.hipayPaymentCategoryList)) {
                    params.payment_product_category_list = pi.custom.hipayPaymentCategoryList;
                }

                helper.fillHeaderData(HiPayConfig, order, params); /* fill in the common params */

                helper.fillOrderData(order, params); /* add order details */

                log.info("HiPay Hosted Page Request ::: \n" + JSON.stringify(params, undefined, 2));

                var hipayResponse    = hiPayHostedService.loadHostedPayment(params, "hipay.rest.hpayment"),
                    hipayRedirectURL = null,
                    msg              = null;

                if (hipayResponse.ok === true) {
                    msg              = JSON.parse(hipayResponse.object.text);
                    hipayRedirectURL = msg.forwardUrl;
                    log.info("HiPay Hosted Page Response ::: \n" + JSON.stringify(msg, undefined, 2));
                } else {
                    log.error(hipayResponse.msg);
                    response.error = true;
                    return response;
                }

                response.hiPayRedirectURL   = hipayRedirectURL;
                response.hiPayIFrameEnabled = HiPayConfig.isIframeEnabled();
            } catch (e) {
                log.error(e);
                response.error = true;
                return response;
            }

            response.error = false;
            return response;
    });
}

HiPayCheckoutModule.saveCreditCard = function(paymentInstrument) {
    var Transaction    = require('dw/system/Transaction'),
        paymentMethod  = "HIPAY_CREDIT_CARD",
        i, creditCards, newCreditCard, status;

    if (customer.authenticated && session.forms.billing.paymentMethods.creditCard.saveCard.value) {
        creditCards = customer.getProfile().getWallet().getPaymentInstruments("HIPAY_CREDIT_CARD"),
        status      = Transaction.wrap(function() {
            newCreditCard = customer.getProfile().getWallet().createPaymentInstrument("HIPAY_CREDIT_CARD");

            if (!newCreditCard) { // no payment instrument given
                Logger.debug("No customer payment instrument given to store credit card data");
                return false;
            }

            if (!paymentMethod.equals(newCreditCard.paymentMethod)) { // given customer payment instrument not a hipay credit card
                Logger.debug("Customer payment instrument is of type {0}, type {1} required.", newCreditCard.paymentMethod, paymentMethod);
                return false;
            }

            if (!paymentMethod.equals(paymentInstrument.paymentMethod)) { // given order payment instrument not a hipay credit card
                Logger.debug("Order payment instrument is of type {0}, type {1} required.", paymentInstrument.paymentMethod, paymentMethod);
                return false;
            }

            // copy the credit card details to the payment instrument
            newCreditCard.setCreditCardHolder(paymentInstrument.creditCardHolder);
            newCreditCard.setCreditCardNumber(paymentInstrument.creditCardNumber);
            newCreditCard.setCreditCardExpirationMonth(paymentInstrument.creditCardExpirationMonth);
            newCreditCard.setCreditCardExpirationYear(paymentInstrument.creditCardExpirationYear);
            newCreditCard.setCreditCardType(paymentInstrument.creditCardType);
            newCreditCard.setCreditCardToken(paymentInstrument.creditCardToken);

            for (i = 0; i < creditCards.length; i++) {
                var creditcard = creditCards[i];

                if (creditcard.maskedCreditCardNumber === newCreditCard.maskedCreditCardNumber && creditcard.creditCardType === newCreditCard.creditCardType) {
                    customer.getProfile().getWallet().removePaymentInstrument(creditcard);
                }
            }

            return true;
        });

        return status;
    }

    return true;
}

HiPayCheckoutModule.getApplicableCreditCards = function(countryCode, amount) {
    var PaymentMgr                = require('dw/order/PaymentMgr'),
        PaymentInstrument         = require('dw/order/PaymentInstrument'),
        ArrayList                 = require('dw/util/ArrayList'),
        paymentInstruments        = customer.getProfile().getWallet().getPaymentInstruments("HIPAY_CREDIT_CARD"),
        methods                   = PaymentMgr.getApplicablePaymentMethods(customer, countryCode, amount), /* Gets applicable payment methods. */
        creditCardMethod          = PaymentMgr.getPaymentMethod(PaymentInstrument.METHOD_CREDIT_CARD), /* Gets applicable payment cards from CREDIT_CARD payment method. */
        cards                     = creditCardMethod ? creditCardMethod.getApplicablePaymentCards(customer, countryCode, amount) : List.EMPTY_LIST,
        validPaymentInstruments   = new ArrayList(paymentInstruments), /* Collects all invalid payment instruments. */
        invalidPaymentInstruments = new ArrayList();

    for (var i = 0; i < paymentInstruments.length; i++) {
        var paymentInstrument = paymentInstruments[i];

        // Ignores gift certificate payment instruments.
        if (PaymentInstrument.METHOD_GIFT_CERTIFICATE.equals(paymentInstrument.paymentMethod)) {
            continue;
        }

        // Gets a payment method.
        var method = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod());

        // Checks whether payment method is still applicable.
        if (method && methods.contains(method)) {
            // In case of method HIPAY_CREDIT_CARD, check payment cards
            if ("HIPAY_CREDIT_CARD".equals(paymentInstrument.paymentMethod)) {
                // Gets payment card.
                var card = PaymentMgr.getPaymentCard(paymentInstrument.creditCardType);

                // Checks whether payment card is still applicable.
                if (card && cards.contains(card)) {
                    continue;
                }
            } else {
                // Continues if method is applicable.
                continue;
            }
        }

        // Collects invalid payment instruments.
        invalidPaymentInstruments.add(paymentInstrument);
        validPaymentInstruments.remove(paymentInstrument);
    }

    if (invalidPaymentInstruments.size()) {
        return {
            InvalidPaymentInstruments: invalidPaymentInstruments,
            ValidPaymentInstruments: validPaymentInstruments
        };
    } else {
        return {
            ValidPaymentInstruments: validPaymentInstruments
        };
    }
}

HiPayCheckoutModule.resetPaymentForms = function() {
    var BasketMgr          = require('dw/order/BasketMgr'),
        PaymentInstrument  = require('dw/order/PaymentInstrument'),
        Transaction        = require('dw/system/Transaction'),
        basket             = BasketMgr.getCurrentBasket(),
        paymentMethodsForm = session.forms.billing.paymentMethods;

    if (basket.getPaymentInstruments().size() > 0) {
        var selectedPaymentInstrument = paymentMethodsForm.selectedPaymentMethodID.value,
            paymentInstruments        = basket.getPaymentInstruments(),
            size                      = paymentInstruments.size(),
            count                     = 0,
            currentPaymentInstrument;

        for (count = 0; count < size; count++) {
            currentPaymentInstrument = paymentInstruments[count];

            if (currentPaymentInstrument.getPaymentMethod() !== selectedPaymentInstrument) {
                var all = basket.getPaymentInstruments(currentPaymentInstrument.getPaymentMethod());

                for (var i = 0; i < all.length; i++) {
                    var pi = all[i];
                    Transaction.wrap(function () {
                        basket.removePaymentInstrument(pi);
                    });
                }
            }
        }
    }

    if (paymentMethodsForm.selectedPaymentMethodID.value.equals('PayPal')) {
        paymentMethodsForm.creditCard.clearFormElement();
        paymentMethodsForm.bml.clearFormElement();
    } else if (paymentMethodsForm.selectedPaymentMethodID.value.equals(PaymentInstrument.METHOD_CREDIT_CARD)) {
        paymentMethodsForm.bml.clearFormElement();
    } else if (paymentMethodsForm.selectedPaymentMethodID.value.equals(PaymentInstrument.METHOD_BML)) {
        paymentMethodsForm.creditCard.clearFormElement();

        if (!paymentMethodsForm.bml.ssn.valid) {
            return false;
        }
    }

    return true;
}

HiPayCheckoutModule.validateBilling = function() {
    var PaymentInstrument  = require('dw/order/PaymentInstrument'),
        paymentMethodsForm = session.forms.billing.paymentMethods,
        creditCardForm     = paymentMethodsForm.creditCard;

    if (!session.forms.billing.billingAddress.valid) {
        return false;
    }

    if (!empty(request.httpParameterMap.noPaymentNeeded.value)) {
        return true;
    }

    if (!empty(paymentMethodsForm.selectedPaymentMethodID.value) && paymentMethodsForm.selectedPaymentMethodID.value.equals(PaymentInstrument.METHOD_CREDIT_CARD)) {
        if (creditCardForm.type.value === 'Amex') {
            if (empty(creditCardForm.ownerfirst) || empty(creditCardForm.ownerlast)) {
                creditCardForm.invalidateFormElement();
                creditCardForm.invalidateFormElement();
                return false;
            }
        } else {
            if (empty(creditCardForm.owner)) {
                creditCardForm.invalidateFormElement();
                return false;
            }
        }

        if (!session.forms.billing.valid) {
            return false;
        }
    }

    return true;
}

module.exports = HiPayCheckoutModule;
