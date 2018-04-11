var ArrayList              = require('dw/util/ArrayList'),
    Map                    = require('dw/util/Map'),
    MapEntry               = require('dw/util/MapEntry'),
    Customer               = require('dw/customer/Customer'),
    Profile                = require('dw/customer/Profile'),
    Order                  = require('dw/order/Order'),
    OrderAddress           = require('dw/order/OrderAddress'),
    OrderPaymentInstrument = require('dw/order/OrderPaymentInstrument'),
    HttpParameterMap       = require('dw/web/HttpParameterMap'),
    statuses               = require('~/cartridge/scripts/lib/hipay/HiPayStatus').HiPayStatus,
    packageJson            = require('~/package');

/**
 * HiPayHelper class manages common HiPay functions.
 *
 * To include this script use:
 * var HiPayHelper = require("~/cartridge/scripts/lib/hipay/HiPayHelper");
 */
function HiPayHelper() {}

HiPayHelper.prototype.fillHeaderData = function(HiPayConfig, order, params) {

    var threshold            = HiPayConfig.hipayEnable3dSecureThresholdRule,
        enforceThresholdRule = false,
        language             = !empty(request.getHttpLocale()) ? request.getHttpLocale() : '';

    if (threshold != 0) {
        var totalAmount;

        if (order.totalGrossPrice.available) {
            totalAmount = order.totalGrossPrice.decimalValue;
        } else {
            totalAmount = order.getAdjustedMerchandizeTotalPrice(true).add(order.giftCertificateTotalPrice).decimalValue;
        }

        if (totalAmount > threshold) {
            enforceThresholdRule = true;
        }
    }

    //use the rule to enforce 3DS depending on the total
    params.authentication_indicator = enforceThresholdRule ? HiPayConfig.THREEDSECURE_AUTH.MANDATORY : HiPayConfig.hipayEnable3dSecure;
    params.ipaddr                   = request.getHttpRemoteAddress();
    params.http_accept              = request.httpHeaders.get('accept');
    params.http_user_agent          = request.getHttpUserAgent();

    //if request.getHttpLocale() === null or had only 'ru' or 'ro' or 'en' etc. Try to check geolocation
    if (language.length === 2) { 
        var geo = request.getGeolocation();

        if (!empty(geo) && !empty(geo.countryCode)) {
            language += '_' + geo.countryCode;
        }
    }

    //always send the redirect urls
    params.language                 = language;
    params.accept_url               = HiPayConfig.acceptURL;
    params.decline_url              = HiPayConfig.declineURL;
    params.pending_url              = HiPayConfig.pendingURL;
    params.exception_url            = HiPayConfig.errorURL;
    params.cancel_url               = HiPayConfig.cancelURL;
}

/* Fills HiPay request data based on DW Order information */
HiPayHelper.prototype.fillOrderData = function(order, params) {
    var totalAmount         = null,
        items               = null,
        categoryList        = [],
        productNames        = [],
        customer            = null,
        profile             = null,
        billingAddress      = null,
        shippingAddress     = null,
        system_version      = dw.system.System.compatibilityMode.toString(),
        brand_version       = system_version.slice(0, system_version.length/2) + "." +  Number(system_version.slice(system_version.length/2)),
        integration_version = packageJson.version;

    if (order.totalGrossPrice.available) {
        totalAmount = order.totalGrossPrice;
    } else {
        totalAmount = order.getAdjustedMerchandizeTotalPrice(true).add(order.giftCertificateTotalPrice);
    }

    items = order.getProductLineItems();

    for each (var item in items) {
        productNames.push(item.getProductName());
        if (!empty(item.getCategory())) {
            categoryList.push(item.getCategory());
        }
    }

    params.currency                      = order.getCurrencyCode();
    params.orderid                       = order.orderNo;
    params.description                   = order.orderNo;
    params.cid                           = order.customer.ID;
    params.amount                        = totalAmount.value;
    params.shipping                      = order.getAdjustedShippingTotalPrice().value;
    params.tax                           = order.getAdjustedMerchandizeTotalTax().value;
    params.payment_product_category_list = categoryList.join(',');
    params.source                        = {"source": "CMS", "brand": "Salesforce Commerce Cloud", "brand_version": brand_version, "integration_version": integration_version};
    params.long_description              = productNames.join(',');
    customer                             = order.customer;
    billingAddress                       = order.billingAddress;

    if (!empty(billingAddress)) {
        params.email     = order.customerEmail;
        params.phone     = billingAddress.phone;
        params.birthdate = "";
        params.firstname = billingAddress.firstName;
        params.lastname  = billingAddress.lastName;
    }

    //guest or no saved address
    if (!empty(billingAddress)) {
        params.recipientinfo = billingAddress.companyName;
        params.streetaddress = billingAddress.address1;

        if (!empty(billingAddress.address2)) {
            params.streetaddress2 = billingAddress.address2;
        }

        params.city    = billingAddress.city;
        params.state   = billingAddress.stateCode;
        params.zipcode = billingAddress.postalCode;
        params.country = billingAddress.countryCode.value;
    }

    //Shipping info
    shippingAddress              = order.defaultShipment.shippingAddress;
    params.shipto_firstname      = shippingAddress.firstName;
    params.shipto_lastname       = shippingAddress.lastName;
    params.shipto_recipientinfo  = shippingAddress.companyName;
    params.shipto_streetaddress  = shippingAddress.address1;
    params.shipto_streetaddress2 = shippingAddress.address2;
    params.shipto_city           = shippingAddress.city;
    params.shipto_state          = shippingAddress.stateCode;
    params.shipto_zipcode        = shippingAddress.postalCode;
    params.shipto_country        = shippingAddress.countryCode.value;
}

/* Creates a formatted text message from the request parameters */
HiPayHelper.prototype.formatRequestData = function(params) {
    var requestLog = [];

    for each(var entry in params.entrySet()) {
        if (!empty(entry.getValue()[0])
            //
            && entry.getKey().toString().indexOf("payment_method[") == -1
            //
            && entry.getKey().toString().indexOf("order[") == -1
            //
            && entry.getKey().toString().indexOf("three_d_secure") == -1
            //
            && entry.getKey().toString().indexOf("fraud_screening[") == -1
            //
            && entry.getKey().toString().indexOf("ip_") == -1
            //
            && entry.getKey().toString().indexOf("test") == -1
            //
            && entry.getKey().toString().indexOf("device_id") == -1
            //
            && entry.getKey().toString().indexOf("cdata") == -1
            //
            && entry.getKey().toString().indexOf("decimals") == -1
            //
            && entry.getKey().toString().indexOf("eci") == -1) {
            requestLog.push(entry.getKey() + " : " + entry.getValue()[0]);
        }
    }

    requestLog.sort();
    return requestLog.join("\n");
}

/* Updated the payment status of in the Order and manages the state of the transaction */
HiPayHelper.prototype.updatePaymentStatus = function(order, paymentInstr, params) {
    var paymentStatus = null,
        statusType    = null;

    if (params instanceof HttpParameterMap) {
        paymentStatus = params.status.stringValue; //=116,117
    } else {
        paymentStatus = params.status;
    }

    //set the payment instrument status
    for (var statusKey in statuses) {
        statusType = statuses[statusKey];
        if (paymentStatus === statusType.code) {
            paymentInstr.custom.hipayTransactionStatus = statusType.value;
            break;
        }
    }

    //if status is 109 to 120 or 124 or 125 or 126 or 129 or 142
    switch (paymentStatus) {
        case statuses.CAPTURED.code:
            //if capture amout is the whole sum
            var captured_amount = null;

            if (params instanceof HttpParameterMap) {
                captured_amount = params.captured_amount.doubleValue;

            } else {
                captured_amount = parseFloat(params.capturedAmount);
            }

            paymentInstr.custom.hipayTransactionCapturedAmount = captured_amount;
            order.paymentStatus = Order.PAYMENT_STATUS_PAID;
            break;
        case statuses.PARTIALLY_CAPTURED.code:
            order.paymentStatus = Order.PAYMENT_STATUS_PARTPAID;
            break;
        default:
            break;
    }

}

/* Create an order note based on the status message */
HiPayHelper.prototype.addOrderNote = function(order, noteSubject) {
    order.addNote(noteSubject, this.formatRequestData(request.getHttpParameters()));
}

/* Retrieves the PaymentInstrument for the Order */
HiPayHelper.prototype.getOrderPaymentInstrument = function(order) {
    var paymentInstr     = null,
        paymentInstrColl = order.getPaymentInstruments();

    if (paymentInstrColl.size() != 0) {
        var list     = new ArrayList(paymentInstrColl);
        paymentInstr = list.get(0);
    }

    if (paymentInstr == null) {
        var message = "No Payment Instrument was found for Order " + order.orderNo + ", please check the configuration!";
        throw new Error(message);
    }

    return paymentInstr;
}

module.exports = HiPayHelper;
