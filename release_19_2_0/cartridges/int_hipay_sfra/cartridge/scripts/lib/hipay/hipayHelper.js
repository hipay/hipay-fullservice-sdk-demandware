var ArrayList = require('dw/util/ArrayList');
var Order = require('dw/order/Order');
var HttpParameterMap = require('dw/web/HttpParameterMap');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Calendar = require('dw/util/Calendar');
var StringUtils = require('dw/util/StringUtils');
var Decimal = require('dw/util/Decimal');
var TaxMgr = require('dw/order/TaxMgr');
var Logger = require('dw/system/Logger');
var statuses = require('~/cartridge/config/hipayStatus').HiPayStatus;

/**
 * HiPayHelper class manages common HiPay functions.
 *
 * To include this script use:
 * var HiPayHelper = require("~/cartridge/scripts/lib/hipay/hipayHelper");
 */

function HiPayHelper() {}

HiPayHelper.prototype.fillHeaderData = function (HiPayConfig, order, params) {
    var threshold = HiPayConfig.hipayEnable3dSecureThresholdRule;
    var enforceThresholdRule = false;
    var language = request.locale;
    var hipayForm = session.forms.billing.hipayMethodsFields;

    if (threshold !== 0) {
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

    // use the rule to enforce 3DS depending on the total
    params.authentication_indicator = enforceThresholdRule ? HiPayConfig.THREEDSECURE_AUTH.MANDATORY : HiPayConfig.hipayEnable3dSecure;  // eslint-disable-line
    params.ipaddr = request.getHttpRemoteAddress();  // eslint-disable-line
    params.http_accept = request.httpHeaders.get('accept');  // eslint-disable-line
    params.http_user_agent = request.getHttpUserAgent();  // eslint-disable-line

    // if request.getHttpLocale() === null or had only 'ru' or 'ro' or 'en' etc. Try to check geolocation
    if (language.length === 2) {
        var geo = request.getGeolocation();

        if (!empty(geo) && !empty(geo.countryCode)) {
            language += '_' + geo.countryCode;
        }
    }

    // always send the redirect urls
    params.language = language;  // eslint-disable-line
    params.accept_url = HiPayConfig.acceptURL;  // eslint-disable-line
    params.decline_url = HiPayConfig.declineURL;  // eslint-disable-line
    params.pending_url = HiPayConfig.pendingURL;  // eslint-disable-line
    params.exception_url = HiPayConfig.errorURL;  // eslint-disable-line
    params.cancel_url = HiPayConfig.cancelURL;  // eslint-disable-line
    params.notify_url = HiPayConfig.notifyURL;  // eslint-disable-line

    if (!empty(hipayForm.klarna.houseNumber.value)) {
        params.house_number = hipayForm.klarna.houseNumber.value;  // eslint-disable-line
    }

    if (!empty(hipayForm.klarna.birthdate.value)) {
        var birthdate = hipayForm.klarna.birthdate.value.replace(/-/g, '');

        params.birthdate = birthdate;  // eslint-disable-line
    }
};

/* Fills HiPay request data based on DW Order information */
HiPayHelper.prototype.fillOrderData = function (order, params, pi) {
    var totalAmount = null;
    var items = null;
    var categoryList = [];
    var productNames = [];
    var customer = null;
    var gender = '';
    var billingAddress = null;
    var shippingAddress = null;
    // var systemVersion = require('dw/system/System').compatibilityMode.toString();
    // var brand_version = systemVersion.slice(0, systemVersion.length/2) + '.' +  Number(systemVersion.slice(systemVersion.length/2));
    var shipments = order.shipments;

    if (order.totalGrossPrice.available) {
        totalAmount = order.totalGrossPrice;
    } else {
        totalAmount = order.getAdjustedMerchandizeTotalPrice(true).add(order.giftCertificateTotalPrice);
    }

    items = order.getProductLineItems();

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        productNames.push(item.getProductName());
        if (!empty(item.getCategory())) {
            categoryList.push(item.getCategory());
        }
    }

    params.currency = order.getCurrencyCode(); // eslint-disable-line
    params.orderid = order.orderNo; // eslint-disable-line
    params.description = order.orderNo; // eslint-disable-line
    params.cid = order.customer.ID; // eslint-disable-line
    params.amount = totalAmount.value; // eslint-disable-line
    params.shipping = order.getAdjustedShippingTotalPrice().value; // eslint-disable-line
    params.tax = order.getTotalTax().value; // eslint-disable-line
    params.payment_product_category_list = categoryList.join(','); // eslint-disable-line
    params.source = JSON.stringify({ 'source': 'CMS', 'brand': 'Demandware', 'brand_version': '1.0.0', 'integration_version': '1.0.0' }); // eslint-disable-line

    params.long_description = productNames.join(','); // eslint-disable-line
    customer = order.customer;
    billingAddress = order.billingAddress;

    if (!empty(customer.profile)) {
        switch (customer.profile.gender.value) {
            case 1:
                gender = 'M';
                break;
            case 2:
                gender = 'F';
                break;
            default:
                gender = '';
                break;
        }
    }

    if (!empty(billingAddress)) {
        params.email = order.customerEmail; // eslint-disable-line
        params.phone = !empty(billingAddress.phone) ? billingAddress.phone.replace(/\s/g, '') : null; // eslint-disable-line

        if (pi.paymentMethod.indexOf('KLARNA') > -1) {
            params.msisdn = !empty(params.phone) ? params.phone : null; // eslint-disable-line

            if (empty(gender)) {
                gender = session.forms.billing.hipayMethodsFields.klarna.gender.value;
            }
        }

        params.firstname = billingAddress.firstName; // eslint-disable-line
        params.lastname = billingAddress.lastName; // eslint-disable-line
    }

    params.gender = gender; // eslint-disable-line

    // guest or no saved address
    if (!empty(billingAddress)) {
        params.recipientinfo = billingAddress.companyName; // eslint-disable-line
        params.streetaddress = billingAddress.address1; // eslint-disable-line

        if (!empty(billingAddress.address2)) {
            params.streetaddress2 = billingAddress.address2; // eslint-disable-line
        }

        params.city = billingAddress.city; // eslint-disable-line

        if (!empty(billingAddress.stateCode)) {
            params.state = billingAddress.stateCode; // eslint-disable-line
        }

        params.zipcode = billingAddress.postalCode; // eslint-disable-line
        params.country = billingAddress.countryCode.value.toUpperCase(); // eslint-disable-line
    }

    // Shipping info
    if (pi.paymentMethod.indexOf('KLARNA') < 0) {
        shippingAddress = order.defaultShipment.shippingAddress; // eslint-disable-line
        params.shipto_firstname = shippingAddress.firstName; // eslint-disable-line
        params.shipto_lastname = shippingAddress.lastName; // eslint-disable-line
        params.shipto_recipientinfo = shippingAddress.companyName; // eslint-disable-line
        params.shipto_streetaddress = shippingAddress.address1; // eslint-disable-line
        params.shipto_streetaddress2 = shippingAddress.address2; // eslint-disable-line
        params.shipto_city = shippingAddress.city; // eslint-disable-line

        if (!empty(shippingAddress.stateCode)) {
            params.shipto_state = shippingAddress.stateCode; // eslint-disable-line
        }

        params.shipto_zipcode = shippingAddress.postalCode; // eslint-disable-line
        params.shipto_country = shippingAddress.countryCode.value.toUpperCase(); // eslint-disable-line
        params.shipto_phone = shippingAddress.phone; // eslint-disable-line
    }

    if (pi.paymentMethod.indexOf('HIPAY_HOSTED_ONEY_FACILITY_PAY') > -1 || pi.paymentMethod.indexOf('HIPAY_ONEY_FACILITY_PAY') > -1 || pi.paymentMethod.indexOf('KLARNA') > -1) {
        var basketObject = [];
        var categoriesCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category').custom.settings;
        var categoriesConfig = JSON.parse(categoriesCO);
        var shippingCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'shipping').custom.settings;
        var shippingConfig = JSON.parse(shippingCO);

        if (pi.paymentMethod.indexOf('KLARNA') < 0) {
            params.shipto_gender = gender; // eslint-disable-line
        }

        if (pi.paymentMethod.indexOf('HIPAY_HOSTED_ONEY_FACILITY_PAY') > -1 || pi.paymentMethod.indexOf('HIPAY_ONEY_FACILITY_PAY') > -1) {
            if (!empty(shipments)) {
                var shipment = shipments[0];
                var shipmentConfig = shippingConfig[shipment.getShippingMethodID()];

                var deliveryMethod = {};
                deliveryMethod.mode = shipmentConfig.deliveryMode;
                deliveryMethod.shipping = shipmentConfig.deliveryMethod;

                params.delivery_method = JSON.stringify(deliveryMethod); // eslint-disable-line

                // Estimated delivery date based on shipping method config from CO OneyExtensionConfig
                // calculated with date of the day + Order preparation estimated time (n days) + Delivery estimated time (n days).
                var calendar = new Calendar();
                var etaDays = 24 * (shipmentConfig.preparationTime + shipmentConfig.deliveryTime); // 24 hours per day

                calendar.add(Calendar.HOUR, etaDays);

                params.delivery_date = StringUtils.formatCalendar(calendar, 'YYYY-MM-dd'); // eslint-disable-line
            }
        }

        // Products section
        for (var plii = 0; plii < order.productLineItems.length; plii++) {
            var pli = order.productLineItems[plii];
            var itemObject = {};
            var productCategory = '';

            var appliedProductTotalDiscount = new Decimal();
            if (!empty(pli.priceAdjustments)) {
                for (var pai = 0; pai < pli.priceAdjustments.length; pai++) {
                    var productPriceAdjustment = pli.priceAdjustments[pai];
                    if (!empty(productPriceAdjustment.promotion) && productPriceAdjustment.promotion.promotionClass === 'PRODUCT') {
                        appliedProductTotalDiscount = appliedProductTotalDiscount.add(productPriceAdjustment.priceValue);
                    }
                }
            }

            var masterProd = pli.product.getMasterProduct();
            var assignedCategories = masterProd.getCategories();

            for (var aci = 0; aci < assignedCategories.length; aci++) {
                var assignedCategory = assignedCategories[aci];
                var categoryId = assignedCategory.getID();

                // check if a current category or if any parent has valid configuration
                var categoryConfig = categoriesConfig[categoryId];
                if (categoryConfig && categoryConfig.hipayCategory !== 0) {
                    productCategory = categoryConfig.hipayCategory;
                }

                // loop further into parent categories in order to receive a product_category value.
                if (empty(productCategory)) {
                    var category;
                    category = assignedCategory;

                    while (category.parent !== null) {
                        categoryConfig = categoriesConfig[category.ID];

                        if (categoryConfig && categoryConfig.hipayCategory !== 0) {
                            productCategory = categoryConfig.hipayCategory;
                        }

                        category = category.parent;
                    }
                }
            }

            itemObject.product_reference = pli.productID;
            itemObject.name = pli.productName;
            itemObject.type = 'good';
            itemObject.quantity = pli.quantityValue;
            itemObject.unit_price = pli.getBasePrice().getValue();
            itemObject.discount = appliedProductTotalDiscount.get();
            itemObject.tax_rate = Number(pli.getTaxRate() * 100).toFixed(2);
            itemObject.total_amount = pli.getAdjustedPrice().getValue();
            itemObject.product_category = Number(productCategory);

            basketObject.push(itemObject);
        }

        // Shipping section
        if (!empty(order.shipments)) {
            var orderShipment = order.shipments[0];
            var shippingLineItem = orderShipment.getStandardShippingLineItem();
            var shippingObject = {};

            shippingObject.product_reference = 'SHIP-' + orderShipment.getShippingMethod().getID();
            shippingObject.name = orderShipment.getShippingMethod().getDisplayName();
            shippingObject.type = 'fee';
            shippingObject.quantity = 1;
            shippingObject.unit_price = orderShipment.getShippingTotalPrice().getValue();
            shippingObject.discount = orderShipment.getAdjustedShippingTotalPrice().getValue() - orderShipment.getShippingTotalPrice().getValue();
            shippingObject.tax_rate = empty(shippingLineItem) ? 0 : Number(shippingLineItem.getTaxRate() * 100).toFixed(2);
            shippingObject.total_amount = orderShipment.getAdjustedShippingTotalPrice().getValue();
            shippingObject.product_category = 1;

            basketObject.push(shippingObject);
        }

        // Tax section
        if (TaxMgr.getTaxationPolicy() === TaxMgr.TAX_POLICY_NET) {
            var taxObject = {};
            taxObject.product_reference = 'Sales Tax';
            taxObject.name = 'Sales Tax';
            taxObject.type = 'fee';
            taxObject.quantity = 1;
            taxObject.unit_price = order.getTotalTax().getValue();
            taxObject.discount = 0;
            taxObject.tax_rate = 0;
            taxObject.total_amount = order.getTotalTax().getValue();

            basketObject.push(taxObject);
        }

        // Order level discounts
        if (!empty(order.getPriceAdjustments())) {
            // for each (var orderPriceAdjustment in order.getPriceAdjustments()) {
            var basketPriceAdjustments = order.getPriceAdjustments().iterator();
            while (basketPriceAdjustments.hasNext()) {
                var orderPriceAdjustment = basketPriceAdjustments.next();

                if (!empty(orderPriceAdjustment.promotion) && orderPriceAdjustment.promotion.promotionClass === 'ORDER') {
                    var appliedOrderTotalDiscount = new Decimal(orderPriceAdjustment.priceValue);
                    var orderDiscountObject = {};

                    orderDiscountObject.product_reference = 'DISC-' + orderPriceAdjustment.promotionID;
                    orderDiscountObject.name = orderPriceAdjustment.promotionID;
                    orderDiscountObject.type = 'discount';
                    orderDiscountObject.quantity = 1;
                    orderDiscountObject.unit_price = 0;
                    orderDiscountObject.discount = appliedOrderTotalDiscount.get();
                    orderDiscountObject.tax_rate = 0;
                    orderDiscountObject.total_amount = appliedOrderTotalDiscount.get();
                    orderDiscountObject.product_category = 1;

                    basketObject.push(orderDiscountObject);
                }
            }
        }

        params.basket = JSON.stringify(basketObject); // eslint-disable-line
    }
};

/* Creates a formatted text message from the request parameters */
HiPayHelper.prototype.formatRequestData = function (params) {
    var requestLog = [];
    var entrysSet = params.entrySet();

    for (var i = 0; i < entrysSet.length; i++) {
        if (!empty(entrysSet[i].getValue()[0])
            //
            && entrysSet[i].getKey().toString().indexOf('payment_method[') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('order[') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('three_d_secure') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('fraud_screening[') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('ip_') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('test') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('device_id') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('cdata') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('decimals') === -1
            //
            && entrysSet[i].getKey().toString().indexOf('eci') === -1) {
            requestLog.push(entrysSet[i].getKey() + ' : ' + entrysSet[i].getValue()[0]);
        }
    }

    requestLog.sort();
    return requestLog.join("\n"); // eslint-disable-line
};

/* Updated the payment status of in the Order and manages the state of the transaction */
HiPayHelper.prototype.updatePaymentStatus = function (order, paymentInstr, params) {
    var paymentStatus = null;
    var statusType = null;

    if (params instanceof HttpParameterMap) {
        paymentStatus = params.status.stringValue; //= 116,117
    } else {
        paymentStatus = params.status;
    }

    // set the payment instrument status
    // a key/value object here. 'for in' loop only here
    for (var statusKey in statuses) { // eslint-disable-line
        statusType = statuses[statusKey];
        if (paymentStatus === statusType.code) {
            paymentInstr.custom.hipayTransactionStatus = statusType.value; // eslint-disable-line
            break;
        }
    }

    // if status is 109 to 120 or 124 or 125 or 126 or 129 or 142
    switch (paymentStatus) {
        case statuses.CAPTURED.code:
            // if capture amout is the whole sum
            var capturedAmount = null;

            if (params instanceof HttpParameterMap) {
                capturedAmount = params.captured_amount.doubleValue; // eslint-disable-line
            } else {
                capturedAmount = parseFloat(params.capturedAmount);
            }

            paymentInstr.custom.hipayTransactionCapturedAmount = capturedAmount; // eslint-disable-line
            order.paymentStatus = Order.PAYMENT_STATUS_PAID; // eslint-disable-line
            break;
        case statuses.PARTIALLY_CAPTURED.code:
            order.paymentStatus = Order.PAYMENT_STATUS_PARTPAID; // eslint-disable-line
            break;
        default:
            break;
    }
};

/* Create an order note based on the status message */
HiPayHelper.prototype.addOrderNote = function (order, noteSubject) {
    order.addNote(noteSubject, this.formatRequestData(request.getHttpParameters()));
};

/* Retrieves the PaymentInstrument for the Order */
HiPayHelper.prototype.getOrderPaymentInstrument = function (order) {
    var paymentInstr = null;
    var paymentInstrColl = order.getPaymentInstruments();

    if (paymentInstrColl.size() !== 0) {
        var list = new ArrayList(paymentInstrColl);
        paymentInstr = list.get(0);
    }

    if (paymentInstr === null) {
        var message = 'No Payment Instrument was found for Order ' + order.orderNo + ', please check the configuration!';
        throw new Error(message);
    }

    return paymentInstr;
};

/* Validates if the Oney payment instrument must be rendered for the selected shipping method
 * Oney payment method should not be displayed if mapped shipping method is not chosen.
 *
 * Oney payment method should not be displayed if order_category_code of at least 1 product is not mapped out.
 * Mapping is required for delivery_method, order_category_code.
 * The order_category_code should work like this:
 * we get the line item >
 * we get the category the product is assigned to >
 * we start matching the category id with the mapping by going up the levels until we find the parent category that is mapped or we hit root;
 * if we hit root, the oney payment method is not displayed
 * */
HiPayHelper.prototype.validateOneyAvailability = function (basket) {
    var decision = false;
    var shippingDecision = false;
    var productDecision = false;

    try {
        var shippingCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'shipping').custom.settings;
        var shippingConfig = JSON.parse(shippingCO);
        var categoriesCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category').custom.settings;
        var categoriesConfig = JSON.parse(categoriesCO);

        // check if the selected shipping method compatible (has configuration) with Oney payment method
        var shipments = basket.shipments;

        if (!empty(shipments)) {
            var shipment = shipments[0];
            var shipmentConfig = shippingConfig[shipment.getShippingMethodID()];

            if (shipmentConfig && !empty(shipmentConfig.preparationTime) && !empty(shipmentConfig.deliveryTime) && shipmentConfig.deliveryMode !== '0' && shipmentConfig.deliveryMethod !== '0') {
                shippingDecision = true;
            }
        }

        // check if a product(s) in basket are compatible with Oney payment method
        var products = basket.getAllProductLineItems();

        if (!empty(products)) {
            for (var i = 0; i < products.length; i++) {
                var pli = products[i];
                var productHasConfiguredCategory = false;

                var masterProd = pli.product.getMasterProduct();
                var assignedCategories = masterProd.getCategories();

                for (var cati = 0; cati < assignedCategories.length; cati++) {
                    var assignedCategory = assignedCategories[cati];
                    var categoryId = assignedCategory.getID();

                    // check if a current category or if any parent has valid configuration
                    var categoryConfig = categoriesConfig[categoryId];
                    if (categoryConfig && categoryConfig.hipayCategory !== 0) {
                        productHasConfiguredCategory = true;
                    }

                    var category;
                    category = assignedCategory;

                    while (category.parent !== null) {
                        categoryConfig = categoriesConfig[category.ID];

                        if (categoryConfig && categoryConfig.hipayCategory !== 0) {
                            productHasConfiguredCategory = true;
                        }

                        category = category.parent;
                    }
                }

                // if at least one product doesn't have a configured category, don't show the Oney payment method
                if (productHasConfiguredCategory === true) {
                    productDecision = true;
                } else {
                    productDecision = false;
                }
            }
        }
    } catch (e) {
        Logger.error('[HiPayHelper.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
    }

    if (shippingDecision === true && productDecision === true) {
        decision = true;
    }

    return decision;
};

module.exports = HiPayHelper;
