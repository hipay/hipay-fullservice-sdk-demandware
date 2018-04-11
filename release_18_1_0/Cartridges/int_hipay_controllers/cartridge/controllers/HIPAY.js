'use strict';

/**
 * Controller that handles HiPay payments
 *
 * @module controllers/HIPAY
 */

/* API Includes */
var ISML = require('dw/template/ISML');

/* Script Modules */
var hiPayModule = require('~/cartridge/scripts/lib/hipay/HiPayCheckoutModule'),
    sitePrefs   = dw.system.Site.getCurrent().getPreferences();

/**
* Creates a HiPay PaymentInstrument
*
* @return {Object} success if the payment instrument is created, error otherwise
*/
function Handle(args) {
    var basket            = args.Basket,
        paymentMethod     = session.forms.billing.paymentMethods.selectedPaymentMethodID.value,
        paymentInstrument;

    if (!empty(paymentMethod)) {
        paymentInstrument = hiPayModule.createPaymentInstrument(basket, paymentMethod, true);

        if (paymentInstrument == null) {
            return { error : true };
        }

        hiPayModule.hiPayUpdatePaymentInstrument(paymentInstrument);

        if (paymentMethod === "HIPAY_CREDIT_CARD") {
            if (CreditCardHandle(paymentInstrument).success) {
                return { success : true };
            } else {
                return { error : true };
            }
        } else {
            return { success : true };
        }
    } else {
        return { error : true };
    }
}

/**
* Verifies a credit card against a valid card number and expiration date
* and possibly invalidates invalid form fields. If the verification was successful
* a credit card payment instrument is created.
*
* @param  {dw.order.PaymentInstrument} paymentInstrument - The payment instrument
* @return {Object} Object indicating success or error
*/
function CreditCardHandle(paymentInstrument) {
    var PaymentMgr           = require('dw/order/PaymentMgr'),
        Transaction          = require('dw/system/Transaction'),
        creditCard           = session.forms.billing.paymentMethods.creditCard,
        hipayEnableOneClick  = sitePrefs.custom["hipayEnableOneClick"],
        hiPayMultiUseToken   = false,
        hiPayToken           = null,
        creditCardHolder,
        creditCardStatus,
        cardNumber,
        cardSecurityCode,
        cardType,
        expirationMonth,
        expirationYear,
        paymentCard,
        hiPayCardBrand,
        hiPayCardNumber,
        hiPayCardExpiryMonth,
        hiPayCardExpiryYear,
        hiPayCardHolder,
        hiPayCardCVC,
        hiPayCardType;

    if (empty(creditCard.uuid.value)) {
        cardNumber       = creditCard.number.value;
        cardSecurityCode = creditCard.cvn.value;
        cardType         = creditCard.type.value
        expirationMonth  = creditCard.expiration.month.value;
        expirationYear   = creditCard.expiration.year.value;

        paymentCard      = PaymentMgr.getPaymentCard(cardType);
        creditCardStatus = paymentCard.verify(expirationMonth, expirationYear, cardNumber, cardSecurityCode);

        if (creditCardStatus.error) {
            hiPayModule.invalidatePaymentCardFormElements(creditCardStatus, creditCard);
            return { error : true };
        }
    }

    if (creditCard.type.value == 'Amex') {
        creditCardHolder = creditCard.ownerfirst.value + ' ' +  creditCard.ownerlast.value;
    } else {
        creditCardHolder = creditCard.owner.value;
    }

    if (!empty(creditCard.uuid.value) && hipayEnableOneClick) { /* If one-click payment */
        var paymentInstruments   = customer.getProfile().getWallet().getPaymentInstruments("HIPAY_CREDIT_CARD"),
            uuid                 = creditCard.uuid.value,
            creditCardInstrument = null,
            selectedCreditCard   = null;

        var instrumentsIter = !empty(uuid) && !empty(paymentInstruments) ? paymentInstruments.iterator() : "";

        while (!empty(instrumentsIter) && instrumentsIter.hasNext()) {
            creditCardInstrument = instrumentsIter.next();

            if (uuid.equals(creditCardInstrument.UUID)) {
                selectedCreditCard = creditCardInstrument;
                break;
            }
        }

        if (empty(selectedCreditCard)) {
            return { error : true };
        }

        hiPayCardNumber      = selectedCreditCard.creditCardNumber;
        hiPayCardExpiryMonth = selectedCreditCard.creditCardExpirationMonth;
        hiPayCardExpiryYear  = selectedCreditCard.creditCardExpirationYear;
        hiPayCardHolder      = selectedCreditCard.creditCardHolder;
        hiPayMultiUseToken   = session.forms.billing.paymentMethods.creditCard.saveCard.value;
        hiPayToken           = selectedCreditCard.creditCardToken;
        hiPayCardType        = selectedCreditCard.creditCardType;
    } else {
        hiPayCardBrand       = paymentInstrument.custom.hipayProductName;
        hiPayCardNumber      = creditCard.number.value;
        hiPayCardExpiryMonth = creditCard.expiration.month.value;
        hiPayCardExpiryYear  = creditCard.expiration.year.value;
        hiPayCardHolder      = creditCardHolder;
        hiPayCardCVC         = creditCard.cvn.value;
        hiPayMultiUseToken   = hipayEnableOneClick && session.forms.billing.paymentMethods.creditCard.saveCard.value,
        hiPayCardType        = creditCard.type.value;
        hiPayTokenResult     = hiPayModule.hiPayGenerateToken(hiPayCardBrand, hiPayCardNumber, hiPayCardExpiryMonth,
            hiPayCardExpiryYear, hiPayCardHolder, hiPayCardCVC, hiPayMultiUseToken);

        if (!empty(hiPayTokenResult) && hiPayTokenResult.error == false) {
            hiPayToken      = hiPayTokenResult.HiPayToken;
            hiPayCardNumber = hiPayTokenResult.HiPayPan;
        } else {
            return { error : true };
        }
    }

    if (hiPayToken != null) {
        Transaction.wrap(function() {
            paymentInstrument.creditCardHolder          = hiPayCardHolder;
            paymentInstrument.creditCardNumber          = hiPayCardNumber;
            paymentInstrument.creditCardType            = hiPayCardType;
            paymentInstrument.creditCardExpirationMonth = hiPayCardExpiryMonth;
            paymentInstrument.creditCardExpirationYear  = hiPayCardExpiryYear;
            paymentInstrument.creditCardToken           = hiPayToken;
        });
    } else {
        return { error : true };
    }

    return { success : true };
}

/**
* Authorize HiPay payment
*
* @param  {dw.order.Order} order
* @param  {dw.order.PaymentInstrument} paymentInstrument
* @return {Object} Object indicating authorized if successful or error otherwise
*/
function Authorize(args) {
    var PaymentMgr             = require('dw/order/PaymentMgr'),
        Transaction            = require('dw/system/Transaction'),
        hipayEnableOneClick    = sitePrefs.custom["hipayEnableOneClick"],
        order                  = args.Order,
        paymentInstrument      = args.PaymentInstrument,
        paymentProcessor       = null,
        paymentMethod          = session.forms.billing.paymentMethods.selectedPaymentMethodID.value,
        recurring              = false,
        hiPayDeviceFingerprint,
        response;

    if (!empty(paymentMethod)) {
        hiPayDeviceFingerprint = session.forms.billing.paymentMethods.deviceFingerprint.value;
        paymentProcessor       = PaymentMgr.getPaymentMethod(paymentMethod).paymentProcessor;

        if (paymentMethod === "HIPAY_CREDIT_CARD" && hipayEnableOneClick) { /* if one-click payment */
            hiPayModule.saveCreditCard(paymentInstrument);
            recurring = !empty(session.forms.billing.paymentMethods.creditCard.uuid.value);
        }

        if (paymentProcessor != null) {
            Transaction.wrap(function() {
                paymentInstrument.paymentTransaction.transactionID    = order.orderNo;
                paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
            });

            response = hiPayModule.hiPayOrderRequest(paymentInstrument, order, hiPayDeviceFingerprint, recurring);

            if (response.error === true) {
                return {
                    error : true,
                    PlaceOrderError : response.hiPayPaymentStatus
                };
            } else {
                if (empty(response.hiPayRedirectURL)) {
                    return { authorized : true };
                } else {
                    ISML.renderTemplate('hipay/hosted/hipayredirect', {
                        HiPayRedirectURL : response.hiPayRedirectURL
                    });

                    return { success : true };
                }
            }
        } else {
            return { error : true };
        }
    } else {
        return { error : true };
    }
}

/** @see {@link module:controllers/Hipay~Handle} */
exports.Handle = Handle;
/** @see {@link module:controllers/Hipay~CreditCardHandle} */
exports.CreditCardHandle = CreditCardHandle;
/** @see {@link module:controllers/Hipay~Authorize} */
exports.Authorize = Authorize;
