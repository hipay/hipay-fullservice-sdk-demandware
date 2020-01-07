'use strict';

var server = require('server');

var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');


server.post('CreateNewAddress', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');
    var AccountModel = require('*/cartridge/models/account');
    var OrderModel = require('*/cartridge/models/order');
    var URLUtils = require('dw/web/URLUtils');
    var UUIDUtils = require('dw/util/UUIDUtils');
    var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
    var Locale = require('dw/util/Locale');

    var basket = BasketMgr.getCurrentBasket();
    if (!basket) {
        res.json({
            redirectUrl: URLUtils.url('Cart-Show').toString(),
            error: true
        });
        return next();
    }

    var pliUUID = req.form.productLineItemUUID || req.querystring.productLineItemUUID;
    var productLineItem = COHelpers.getProductLineItem(basket, pliUUID);
    var uuid = UUIDUtils.createUUID();
    var shipment;

    try {
        Transaction.wrap(function () {
            shipment = basket.createShipment(uuid);
            productLineItem.setShipment(shipment);
            ShippingHelper.ensureShipmentHasMethod(shipment);
        });
        Transaction.wrap(function () {
            COHelpers.ensureNoEmptyShipments(req);
            COHelpers.recalculateBasket(basket);
        });
    } catch (err) {
        res.json({
            redirectUrl: URLUtils.url('Checkout-Begin').toString(),
            error: true
        });
        return next();
    }

    var currentLocale = Locale.getLocale(req.locale.id);

    res.json({
        uuid: uuid,
        customer: new AccountModel(req.currentCustomer),
        order: new OrderModel(basket, { countryCode: currentLocale.country, containerView: 'basket' })
    });
    return next();
});


server.post(
    'AddNewAddress',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var Transaction = require('dw/system/Transaction');
        var AccountModel = require('*/cartridge/models/account');
        var OrderModel = require('*/cartridge/models/order');
        var UUIDUtils = require('dw/util/UUIDUtils');
        var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
        var Locale = require('dw/util/Locale');

        var pliUUID = req.form.productLineItemUUID;
        var shipmentUUID = req.form.shipmentSelector || req.form.shipmentUUID;
        var origUUID = req.form.originalShipmentUUID;

        var form = server.forms.getForm('shipping');
        var shippingFormErrors = COHelpers.validateShippingForm(form.shippingAddress.addressFields);
        var basket = BasketMgr.getCurrentBasket();
        var result = {};

        var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');

        if (Object.keys(shippingFormErrors).length > 0) {
            if (shipmentUUID === 'new') {
                req.session.privacyCache.set(origUUID, 'invalid');
            } else {
                req.session.privacyCache.set(shipmentUUID, 'invalid');
            }
            res.json({
                form: form,
                fieldErrors: [shippingFormErrors],
                serverErrors: [],
                error: true
            });
        } else {
            result.address = {
                firstName: form.shippingAddress.addressFields.firstName.value,
                lastName: form.shippingAddress.addressFields.lastName.value,
                address1: form.shippingAddress.addressFields.address1.value,
                address2: form.shippingAddress.addressFields.address2.value,
                city: form.shippingAddress.addressFields.city.value,
                postalCode: form.shippingAddress.addressFields.postalCode.value,
                countryCode: form.shippingAddress.addressFields.country.value,
                phone: form.shippingAddress.addressFields.phone.value
            };

            if (Object.prototype.hasOwnProperty
                .call(form.shippingAddress.addressFields, 'states')) {
                result.address.stateCode =
                    form.shippingAddress.addressFields.states.stateCode.value;
            }

            result.shippingBillingSame =
                form.shippingAddress.shippingAddressUseAsBillingAddress.value;

            result.shippingMethod =
                form.shippingAddress.shippingMethodID.value ?
                    '' + form.shippingAddress.shippingMethodID.value : null;
            result.form = form;

            result.isGift = form.shippingAddress.isGift.checked;

            result.giftMessage = result.isGift ? form.shippingAddress.giftMessage.value : null;

            res.setViewData(result);
        }

        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var viewData = res.getViewData();

            if (viewData.error) {
                res.json(viewData);
                return;
            }

            var shipment;

            if (!COHelpers.isShippingAddressInitialized()) {
                // First use always applies to defaultShipment
                COHelpers.copyShippingAddressToShipment(viewData, basket.defaultShipment);
                shipment = basket.defaultShipment;
            } else {
                try {
                    Transaction.wrap(function () {
                        if (origUUID === shipmentUUID) {
                            // An edit to the address or shipping method
                            shipment = ShippingHelper.getShipmentByUUID(basket, shipmentUUID);
                            COHelpers.copyShippingAddressToShipment(viewData, shipment);
                        } else {
                            var productLineItem = COHelpers.getProductLineItem(basket, pliUUID);
                            if (shipmentUUID === 'new') {
                                // Choosing a new address for this pli
                                if (origUUID === basket.defaultShipment.UUID
                                    && basket.defaultShipment.productLineItems.length === 1) {
                                    // just replace the built-in one
                                    shipment = basket.defaultShipment;
                                } else {
                                    // create a new shipment and associate the current pli (later)
                                    shipment = basket.createShipment(UUIDUtils.createUUID());
                                }
                            } else if (shipmentUUID.indexOf('ab_') === 0) {
                                shipment = basket.createShipment(UUIDUtils.createUUID());
                            } else {
                                // Choose an existing shipment for this PLI
                                shipment = ShippingHelper.getShipmentByUUID(basket, shipmentUUID);
                            }
                            COHelpers.copyShippingAddressToShipment(viewData, shipment);
                            productLineItem.setShipment(shipment);

                            COHelpers.ensureNoEmptyShipments(req);
                        }
                    });
                } catch (e) {
                    viewData.error = e;
                }
            }

            if (shipment && shipment.UUID) {
                req.session.privacyCache.set(shipment.UUID, 'valid');
                viewData.shipmentUUID = shipment.UUID;
            }

            // Loop through all shipments and make sure all are valid
            var isValid;
            var allValid = true;
            for (var i = 0, ii = basket.shipments.length; i < ii; i++) {
                isValid = req.session.privacyCache.get(basket.shipments[i].UUID);
                if (isValid !== 'valid') {
                    allValid = false;
                    break;
                }
            }

            if (shipment && viewData && !!viewData.isGift) {
                var giftResult = COHelpers.setGift(shipment, viewData.isGift, viewData.giftMessage);

                if (giftResult.error) {
                    res.json({
                        error: giftResult.error,
                        fieldErrors: [],
                        serverErrors: [giftResult.errorMessage]
                    });
                    return;
                }
            }

            if (!basket.billingAddress) {
                if (req.currentCustomer.addressBook
                    && req.currentCustomer.addressBook.preferredAddress) {
                    // Copy over preferredAddress (use addressUUID for matching)
                    COHelpers.copyBillingAddressToBasket(
                        req.currentCustomer.addressBook.preferredAddress, basket);
                } else {
                    // Copy over first shipping address (use shipmentUUID for matching)
                    COHelpers.copyBillingAddressToBasket(basket.defaultShipment.shippingAddress, basket);
                }
            }

            COHelpers.recalculateBasket(basket);

            var currentLocale = Locale.getLocale(req.locale.id);
            var basketModel = new OrderModel(
                basket,
                {
                    usingMultiShipping: usingMultiShipping,
                    shippable: allValid,
                    countryCode: currentLocale.country,
                    containerView: 'basket'
                }
            );

            var accountModel = new AccountModel(req.currentCustomer);

            res.json({
                form: form,
                data: viewData,
                order: basketModel,
                customer: accountModel,
                fieldErrors: [],
                serverErrors: [],
                error: false
            });
        });

        return next();
    }
);

module.exports = server.exports();
