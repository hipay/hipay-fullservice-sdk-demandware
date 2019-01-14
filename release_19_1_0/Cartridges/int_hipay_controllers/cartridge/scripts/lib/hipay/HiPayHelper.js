var ArrayList              = require('dw/util/ArrayList'),
    Map                    = require('dw/util/Map'),
    MapEntry               = require('dw/util/MapEntry'),
    Customer               = require('dw/customer/Customer'),
    Profile                = require('dw/customer/Profile'),
    Order                  = require('dw/order/Order'),
    OrderAddress           = require('dw/order/OrderAddress'),
    OrderPaymentInstrument = require('dw/order/OrderPaymentInstrument'),
    HttpParameterMap       = require('dw/web/HttpParameterMap'),
    CustomObjectMgr        = require('dw/object/CustomObjectMgr'),
    Calendar               = require('dw/util/Calendar'),
    StringUtils            = require('dw/util/StringUtils'),
    Decimal                = require('dw/util/Decimal'),
    TaxMgr                 = require('dw/order/TaxMgr'),
    Logger                 = require('dw/system/Logger'),
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
HiPayHelper.prototype.fillOrderData = function(order, params, pi) {
    var totalAmount         = null,
        items               = null,
        categoryList        = [],
        productNames        = [],
        customer            = null,
        gender              = '',
        profile             = null,
        billingAddress      = null,
        shippingAddress     = null,
        system_version      = dw.system.System.compatibilityMode.toString(),
        brand_version       = system_version.slice(0, system_version.length/2) + "." +  Number(system_version.slice(system_version.length/2)),
        integration_version = packageJson.version,
        shipments           = order.shipments;

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
    params.tax                           = order.getTotalTax().value;
    params.payment_product_category_list = categoryList.join(',');
    //params.source                        = JSON.stringify({"source": "CMS", "brand": "Salesforce Commerce Cloud", "brand_version": brand_version, "integration_version": integration_version});
    params.source                        = JSON.stringify({"source": "CMS", "brand": "Demandware", "brand_version": "1.0.0", "integration_version": "1.0.0"});

    params.long_description              = productNames.join(',');
    customer                             = order.customer;
    billingAddress                       = order.billingAddress;

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
    params.gender = gender;
    
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
        params.country = billingAddress.countryCode.value.toUpperCase();
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
    params.shipto_country        = shippingAddress.countryCode.value.toUpperCase();
    params.shipto_phone          = shippingAddress.phone;

    if (pi.paymentMethod.equals('HIPAY_HOSTED_ONEY_FACILITY_PAY') || pi.paymentMethod.equals('HIPAY_ONEY_FACILITY_PAY')) {
        var basketObject     = [],
            categoriesCO     = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category').getCustom()['settings'],
            categoriesConfig = JSON.parse(categoriesCO),
            shippingCO       = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'shipping').getCustom()['settings'],
            shippingConfig   = JSON.parse(shippingCO);

        params.shipto_gender = gender;
        
        if (!empty(shipments)) {
            var shipment       = shipments[0],
                shipmentConfig = shippingConfig[shipment.getShippingMethodID()];

            var delivery_method      = {};
            delivery_method.mode     = shipmentConfig.deliveryMode;
            delivery_method.shipping = shipmentConfig.deliveryMethod;
            
            params.delivery_method = JSON.stringify(delivery_method);
        }
        
        
        //Estimated delivery date based on shipping method config from CO OneyExtensionConfig
        //calculated with date of the day + Order preparation estimated time (n days) + Delivery estimated time (n days).
        if (shipmentConfig) {
            var calendar = new Calendar(),
                etaDays  = 24 * (shipmentConfig.preparationTime + shipmentConfig.deliveryTime); //24 hours per day

            calendar.add(Calendar.HOUR, etaDays);

            params.delivery_date = StringUtils.formatCalendar(calendar, 'YYYY-MM-dd');
        }

       	

        //Products section
	        for each (var pli in order.productLineItems) {
	            var itemObject      = {},
	                productCategory = '';

	            var appliedProductTotalDiscount = new Decimal();
	            if (!empty(pli.priceAdjustments)) {
	                for each (var productPriceAdjustment in pli.priceAdjustments) {
	                    if (!empty(productPriceAdjustment.promotion) && productPriceAdjustment.promotion.promotionClass === 'PRODUCT') {
	                        appliedProductTotalDiscount = appliedProductTotalDiscount.add(productPriceAdjustment.priceValue);
	                    }
	                }
	            }
	            
	            var masterProd = pli.product.getMasterProduct();
                var assignedCategories = masterProd.getCategories();

                for each (var assignedCategory in assignedCategories) {
                    var categoryId = assignedCategory.getID();

                    //check if a current category or if any parent has valid configuration
                    var categoryConfig = categoriesConfig[categoryId];
                    if (categoryConfig && categoryConfig.hipayCategory != 0) {
                    	productCategory = categoryConfig.hipayCategory;
                    }

                    //loop further into parent categories in order to receive a product_category value.
                    if (empty(productCategory)) {
                    	var category;
                        category = assignedCategory;

                        while (category.parent != null) {
                            var categoryConfig = categoriesConfig[category.ID];

                            if (categoryConfig && categoryConfig.hipayCategory != 0) {
                                productCategory = categoryConfig.hipayCategory;
                            }

                            category = category.parent;
                        }
                    }
                }
	            
	            itemObject.product_reference = pli.productID;
	            itemObject.name              = pli.productName;
	            itemObject.type              = 'good';
	            itemObject.quantity          = pli.quantityValue;
	            itemObject.unit_price        = pli.getBasePrice().getValue();
	            itemObject.discount          = appliedProductTotalDiscount.get();
	            itemObject.tax_rate          = Number(pli.getTaxRate() * 100).toFixed(2); 
	            itemObject.total_amount      = pli.getAdjustedPrice().getValue();
	            itemObject.product_category  = Number(productCategory);
	
	            basketObject.push(itemObject);
	        }
        
        //Shipping section
	        if (!empty(order.shipments)) {
	            var shipment         = order.shipments[0],
	                shippingLineItem = shipment.getStandardShippingLineItem(),
	                shippingObject   = {};
	            
	            shippingObject.product_reference = 'SHIP-' + shipment.getShippingMethod().getID();
	            shippingObject.name              = shipment.getShippingMethod().getDisplayName();
	            shippingObject.type              = 'fee';
	            shippingObject.quantity          = 1;
	            shippingObject.unit_price        = shipment.getShippingTotalPrice().getValue();
	            shippingObject.discount          = shipment.getAdjustedShippingTotalPrice().getValue() - shipment.getShippingTotalPrice().getValue();
	            shippingObject.tax_rate          = empty(shippingLineItem) ? 0 : Number(shippingLineItem.getTaxRate() * 100).toFixed(2);
	            shippingObject.total_amount      = shipment.getAdjustedShippingTotalPrice().getValue();
	            shippingObject.product_category  = 1;
	            
	            basketObject.push(shippingObject);
	        }
        
        //Tax section
	        if (TaxMgr.getTaxationPolicy() == TaxMgr.TAX_POLICY_NET) {
	        	var taxObject = {};
		        taxObject.product_reference = 'Sales Tax';
		        taxObject.name              = 'Sales Tax';
		        taxObject.type              = 'fee';
		        taxObject.quantity          = 1;
		        taxObject.unit_price        = order.getTotalTax().getValue();
		        taxObject.discount          = 0;
		        taxObject.tax_rate          = 0;
		        taxObject.total_amount      = order.getTotalTax().getValue();
		        
		        basketObject.push(taxObject);
	        }

        //Order level discounts
	        if (!empty(order.getPriceAdjustments())) {
	            for each (var orderPriceAdjustment in order.getPriceAdjustments()) {
	                if (!empty(orderPriceAdjustment.promotion) && orderPriceAdjustment.promotion.promotionClass === 'ORDER') {
	                    
	                    var appliedOrderTotalDiscount = new Decimal(orderPriceAdjustment.priceValue);
	                    
	                    var orderDiscountObject = {};
	                    
	                    orderDiscountObject.product_reference = 'DISC-' + orderPriceAdjustment.promotionID;
	                    orderDiscountObject.name              = orderPriceAdjustment.promotionID;
	                    orderDiscountObject.type              = 'discount';
	                    orderDiscountObject.quantity          = 1;
	                    orderDiscountObject.unit_price        = 0;
	                    orderDiscountObject.discount          = appliedOrderTotalDiscount.get();
	                    orderDiscountObject.tax_rate          = 0;
	                    orderDiscountObject.total_amount      = appliedOrderTotalDiscount.get();
	                    orderDiscountObject.product_category  = 1;
	
	                    basketObject.push(orderDiscountObject);
	                }
	            }
	        }

        params.basket = JSON.stringify(basketObject);
    }
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
HiPayHelper.prototype.validateOneyAvailability = function(basket) {
    var shippingCO       = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'shipping').getCustom()['settings'],
        shippingConfig   = JSON.parse(shippingCO),
        categoriesCO     = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category').getCustom()['settings'],
        categoriesConfig = JSON.parse(categoriesCO),
        decision         = false,
        shippingDecision = false,
        productDecision  = false;

    try {
        //check if the selected shipping method compatible (has configuration) with Oney payment method
        var shipments = basket.shipments;

        if (!empty(shipments)) {
            var shipment       = shipments[0],
                shipmentConfig = shippingConfig[shipment.getShippingMethodID()];

            if (shipmentConfig && !empty(shipmentConfig.preparationTime) && !empty(shipmentConfig.deliveryTime) && shipmentConfig.deliveryMode != '0' && shipmentConfig.deliveryMethod != '0') {
                shippingDecision = true;
            }
        }

        //check if a product(s) in basket are compatible with Oney payment method
        var products = basket.getAllProductLineItems();

        if (!empty(products)) {
            for each (pli in products) {
                var productHasConfiguredCategory = false;

                var masterProd = pli.product.getMasterProduct();
                var assignedCategories = masterProd.getCategories();

                for each (var assignedCategory in assignedCategories) {
                    var categoryId = assignedCategory.getID();

                    //check if a current category or if any parent has valid configuration
                    var categoryConfig = categoriesConfig[categoryId];
                    if (categoryConfig && categoryConfig.hipayCategory != 0) {
                        productHasConfiguredCategory = true;
                    }

                    var category;
                    category = assignedCategory;

                    while (category.parent != null) {
                        var categoryConfig = categoriesConfig[category.ID];

                        if (categoryConfig && categoryConfig.hipayCategory != 0) {
                            productHasConfiguredCategory = true;
                        }

                        category = category.parent;
                    }
                }

                //if at least one product doesn't have a configured category, don't show the Oney payment method
                if (productHasConfiguredCategory === true) {
                    productDecision = true;
                } else {
                    productDecision = false;
                }
            }
        }
    } catch(e) {
        Logger.error("[HiPayHelper.js] crashed on line: " + e.lineNumber + " with error: " + e);
    }

    if (shippingDecision === true && productDecision === true) {
        decision = true;
    }

    return decision;
}

module.exports = HiPayHelper;
