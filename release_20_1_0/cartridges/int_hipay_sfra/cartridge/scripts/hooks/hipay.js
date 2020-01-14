'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Resource = require('dw/web/Resource');
var PaymentStatusCodes = require('dw/order/PaymentStatusCodes');
var Transaction = require('dw/system/Transaction');
var PaymentMgr = require('dw/order/PaymentMgr');

/* Script Modules */
var hiPayCheckoutModule = require('*/cartridge/scripts/lib/hipay/modules/hipayCheckoutModule');
var collections = require('*/cartridge/scripts/util/collections');
var sitePrefs = require('dw/system/Site').getCurrent().getPreferences().getCustom();

/**
* Verifies a credit card against a valid card number and expiration date
* and possibly invalidates invalid form fields. If the verification was successful
* a credit card payment instrument is created.
*
* @param  {dw.order.PaymentInstrument} paymentInstrument - The payment instrument
* @return {Object} Object indicating success or error
*/
function creditCardHandle(paymentInstrument, paymentInformation, paymentUUID) {
    var creditCard = paymentInformation;
    var hipayEnableOneClick = sitePrefs.hipayEnableOneClick;
    var hiPayMultiUseToken = false;
    var hiPayToken = null;
    var cardErrors = {};
    var serverErrors = [];
    var creditCardHolder;
    var creditCardStatus;
    var cardNumber;
    var cardSecurityCode;
    var cardType;
    var expirationMonth;
    var expirationYear;
    var paymentCard;
    var hiPayCardBrand;
    var hiPayCardNumber;
    var hiPayCardExpiryMonth;
    var hiPayCardExpiryYear;
    var hiPayCardHolder;
    var hiPayCardCVC;
    var hiPayCardType;

    if (empty(paymentUUID)) {
        cardNumber = creditCard.cardNumber.value;

        if (!empty(creditCard.securityCode)) {
            cardSecurityCode = creditCard.securityCode.value;
        }

        cardType = creditCard.cardType.value;
        expirationMonth = creditCard.expirationMonth.value;
        expirationYear = creditCard.expirationYear.value;

        paymentCard = PaymentMgr.getPaymentCard(cardType);

        if (!empty(cardSecurityCode)) {
            creditCardStatus = paymentCard.verify(expirationMonth, expirationYear, cardNumber, cardSecurityCode);
        } else {
            creditCardStatus = paymentCard.verify(expirationMonth, expirationYear, cardNumber);
        }

        if (creditCardStatus.error) {
            hiPayCheckoutModule.invalidatePaymentCardFormElements(creditCardStatus, creditCard);

            collections.forEach(creditCardStatus.items, function (item) {
                switch (item.code) {
                    case PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER:
                        cardErrors[paymentInformation.cardNumber.htmlName] =
                            Resource.msg('error.invalid.card.number', 'creditCard', null);
                        break;

                    case PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE:
                        cardErrors[paymentInformation.expirationMonth.htmlName] =
                            Resource.msg('error.expired.credit.card', 'creditCard', null);
                        cardErrors[paymentInformation.expirationYear.htmlName] =
                            Resource.msg('error.expired.credit.card', 'creditCard', null);
                        break;

                    case PaymentStatusCodes.CREDITCARD_INVALID_SECURITY_CODE:
                        cardErrors[paymentInformation.securityCode.htmlName] =
                            Resource.msg('error.invalid.security.code', 'creditCard', null);
                        break;
                    default:
                        serverErrors.push(
                            Resource.msg('error.card.information.error', 'creditCard', null)
                        );
                }
            });

            return { fieldErrors: [cardErrors], serverErrors: serverErrors, error: true };
        }
    }

    if (!empty(creditCard.cardOwner.value)) {
        if (creditCard.cardType.value === 'Amex') {
            var fullName = creditCard.cardOwner.value;

            creditCardHolder = fullName.split(' ').join('.');
        } else {
            creditCardHolder = creditCard.cardOwner.value;
        }
    }

    if (!empty(paymentUUID) && hipayEnableOneClick) { // If one-click payment
        var paymentInstruments = customer.getProfile().getWallet().getPaymentInstruments('HIPAY_CREDIT_CARD');
        var uuid = paymentUUID;
        var creditCardInstrument = null;
        var selectedCreditCard = null;

        var instrumentsIter = !empty(uuid) && !empty(paymentInstruments) ? paymentInstruments.iterator() : '';

        while (!empty(instrumentsIter) && instrumentsIter.hasNext()) {
            creditCardInstrument = instrumentsIter.next();

            if (uuid.equals(creditCardInstrument.UUID)) {
                selectedCreditCard = creditCardInstrument;
                break;
            }
        }

        if (empty(selectedCreditCard)) {
            return { error: true };
        }

        hiPayCardNumber = selectedCreditCard.creditCardNumber;
        hiPayCardExpiryMonth = selectedCreditCard.creditCardExpirationMonth;
        hiPayCardExpiryYear = selectedCreditCard.creditCardExpirationYear;
        hiPayCardHolder = selectedCreditCard.creditCardHolder;
        hiPayMultiUseToken = session.forms.billing.creditCardFields.saveCard.value;
        hiPayToken = selectedCreditCard.creditCardToken;
        hiPayCardType = selectedCreditCard.creditCardType;
    } else {
        hiPayCardBrand = paymentInstrument.custom.hipayProductName;
        hiPayCardNumber = creditCard.cardNumber.value;
        hiPayCardExpiryMonth = creditCard.expirationMonth.value;
        hiPayCardExpiryYear = creditCard.expirationYear.value;
        hiPayCardHolder = creditCardHolder;

        if (!empty(creditCard.securityCode)) {
            hiPayCardCVC = creditCard.securityCode.value;
        }

        hiPayMultiUseToken = hipayEnableOneClick && session.forms.billing.creditCardFields.saveCard.value;
        hiPayCardType = creditCard.cardType.value;

        var hiPayTokenResult = hiPayCheckoutModule.hiPayGenerateToken(hiPayCardBrand, hiPayCardNumber, hiPayCardExpiryMonth,
            hiPayCardExpiryYear, hiPayCardHolder, hiPayCardCVC, hiPayMultiUseToken);

        if (!empty(hiPayTokenResult) && hiPayTokenResult.error === false) {
            hiPayToken = hiPayTokenResult.HiPayToken;
            hiPayCardNumber = hiPayTokenResult.HiPayPan;
        } else {
            return { error: true };
        }
    }

    if (hiPayToken != null) {
        Transaction.wrap(function () {
            paymentInstrument.setCreditCardHolder(hiPayCardHolder);
            paymentInstrument.setCreditCardNumber(hiPayCardNumber);
            paymentInstrument.setCreditCardType(hiPayCardType);
            paymentInstrument.setCreditCardExpirationMonth(hiPayCardExpiryMonth);
            paymentInstrument.setCreditCardExpirationYear(hiPayCardExpiryYear);
            paymentInstrument.setCreditCardToken(hiPayToken);
        });
    } else {
        return { error: true };
    }

    return { success: true };
}

/**
* Creates a HiPay PaymentInstrument
*
* @return {Object} success if the payment instrument is created, error otherwise
*/
function Handle(currentBasket, paymentInformation, paymentUUID) {
    var basket = currentBasket;
    var paymentMethod = session.forms.billing.paymentMethod.value;
    var paymentInstrument;

    if (!empty(paymentMethod)) {
        paymentInstrument = hiPayCheckoutModule.createPaymentInstrument(basket, paymentMethod, true);

        if (paymentInstrument == null) {
            return { error: true };
        }

        hiPayCheckoutModule.hiPayUpdatePaymentInstrument(paymentInstrument, paymentInformation);

        if (paymentMethod === 'HIPAY_CREDIT_CARD') {
            var handleResponse = creditCardHandle(paymentInstrument, paymentInformation, paymentUUID);

            if (handleResponse.success) {
                return { success: true };
            } else { // eslint-disable-line
                return { fieldErrors: handleResponse.fieldErrors, serverErrors: handleResponse.serverErrors, error: true };
            }
        } else { // eslint-disable-line
            return { success: true };
        }
    } else {
        return { error: true };
    }
}

/**
* Authorize HiPay payment
*
* @param  {dw.order.Order} order
* @param  {dw.order.PaymentInstrument} paymentInstrument
* @return {Object} Object indicating authorized if successful or error otherwise
*/
function Authorize(orderNumber, paymentInstrument, paymentProcessor, storedPaymentUUID) {
    var hipayEnableOneClick = sitePrefs.hipayEnableOneClick;
    var order = OrderMgr.getOrder(orderNumber);
    var paymentProcessor = null; // eslint-disable-line no-redeclare
    var paymentMethod = session.forms.billing.paymentMethod.value;
    var recurring = false;
    var hiPayDeviceFingerprint;
    var response;

    if (!empty(paymentMethod)) {
        hiPayDeviceFingerprint = session.forms.billing.deviceFingerprint.value;
        paymentProcessor = PaymentMgr.getPaymentMethod(paymentMethod).paymentProcessor; // eslint-disable-line no-param-reassign

        if (paymentMethod === 'HIPAY_CREDIT_CARD' && hipayEnableOneClick) { // if one-click payment
            recurring = !empty(storedPaymentUUID);
        }

        if (paymentProcessor != null) {
            Transaction.wrap(function () {
                paymentInstrument.paymentTransaction.setTransactionID(order.orderNo);
                paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
            });

            response = hiPayCheckoutModule.hiPayOrderRequest(paymentInstrument, order, hiPayDeviceFingerprint, recurring);

            if (response.error === true) {
                return {
                    error: true,
                    PlaceOrderError: response.hiPayPaymentStatus
                };
            } else { // eslint-disable-line
                if (paymentMethod === 'HIPAY_CREDIT_CARD' && hipayEnableOneClick && !paymentInstrument.custom.hipayOneClickDisabled) { // if one-click payment
                    hiPayCheckoutModule.saveCreditCard(paymentInstrument, order.customerName);
                }

                if (empty(response.hiPayRedirectURL)) {
                    return { authorized: true };
                } else { // eslint-disable-line
                    return {
                        HiPay: true,
                        HiPayRedirectURL: response.hiPayRedirectURL,
                        API: true,
                        success: true
                    };
                }
            }
        } else {
            return { error: true };
        }
    } else {
        return { error: true };
    }
}

/** @see {@link module:controllers/Hipay~Handle} */
exports.Handle = Handle;
/** @see {@link module:controllers/Hipay~Authorize} */
exports.Authorize = Authorize;
