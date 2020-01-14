'use strict';

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');


server.post('ToggleMultiShip', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');
    var AccountModel = require('*/cartridge/models/account');
    var OrderModel = require('*/cartridge/models/order');
    var URLUtils = require('dw/web/URLUtils');
    var collections = require('*/cartridge/scripts/util/collections');
    var Locale = require('dw/util/Locale');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var shippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket) {
        res.json({
            error: true,
            cartError: true,
            fieldErrors: [],
            serverErrors: [],
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return;
    }

    var shipments = currentBasket.shipments;
    var defaultShipment = currentBasket.defaultShipment;
    var usingMultiShipping = req.form.usingMultiShip === 'true';

    req.session.privacyCache.set('usingMultiShipping', usingMultiShipping);


    if (usingMultiShipping) {
        var UUIDUtils = require('dw/util/UUIDUtils');
        // split line items into separate shipments
        Transaction.wrap(function () {
            collections.forEach(shipments, function (shipment) {
                if (shipment.productLineItems.length > 1) {
                    collections.forEach(shipment.productLineItems, function (lineItem) {
                        var uuid = UUIDUtils.createUUID();
                        var newShipment = currentBasket.createShipment(uuid);
                        // only true if customer is registered
                        if (req.currentCustomer.addressBook && req.currentCustomer.addressBook.preferredAddress) {
                            var preferredAddress = req.currentCustomer.addressBook.preferredAddress;
                            COHelpers.copyCustomerAddressToShipment(preferredAddress, newShipment);
                        }

                        shippingHelpers.selectShippingMethod(newShipment);
                        lineItem.setShipment(newShipment);
                    });
                }
            });

            shippingHelpers.selectShippingMethod(defaultShipment);
            defaultShipment.createShippingAddress();

            COHelpers.ensureNoEmptyShipments(req);

            basketCalculationHelpers.calculateTotals(currentBasket);
        });
    } else {
        // combine multiple shipments into a single one
        Transaction.wrap(function () {
            collections.forEach(shipments, function (shipment) {
                if (!shipment.default) {
                    collections.forEach(shipment.productLineItems, function (lineItem) {
                        lineItem.setShipment(defaultShipment);
                    });
                    currentBasket.removeShipment(shipment);
                }
            });

            shippingHelpers.selectShippingMethod(defaultShipment);
            defaultShipment.createShippingAddress();

            COHelpers.ensureNoEmptyShipments(req);

            if (req.currentCustomer.addressBook && req.currentCustomer.addressBook.preferredAddress) {
                var preferredAddress = req.currentCustomer.addressBook.preferredAddress;
                COHelpers.copyCustomerAddressToShipment(preferredAddress);
            }

            basketCalculationHelpers.calculateTotals(currentBasket);
        });
    }

    var currentLocale = Locale.getLocale(req.locale.id);

    var basketModel = new OrderModel(
        currentBasket,
        { usingMultiShipping: usingMultiShipping, countryCode: currentLocale.country, containerView: 'basket' }
    );

    res.json({
        customer: new AccountModel(req.currentCustomer),
        order: basketModel
    });

    next();
});

server.post('SelectShippingMethod', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var Transaction = require('dw/system/Transaction');
    var AccountModel = require('*/cartridge/models/account');
    var OrderModel = require('*/cartridge/models/order');
    var URLUtils = require('dw/web/URLUtils');
    var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
    var Locale = require('dw/util/Locale');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return next();
    }

    var shipmentUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;
    var shippingMethodID = req.querystring.methodID || req.form.methodID;
    var shipment;
    if (shipmentUUID) {
        shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipmentUUID);
    } else {
        shipment = currentBasket.defaultShipment;
    }

    var viewData = res.getViewData();
    viewData.address = ShippingHelper.getAddressFromRequest(req);
    viewData.isGift = req.form.isGift === 'true';
    viewData.giftMessage = req.form.isGift ? req.form.giftMessage : null;
    res.setViewData(viewData);

    this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var shippingData = res.getViewData();
        var address = shippingData.address;

        try {
            Transaction.wrap(function () {
                var shippingAddress = shipment.shippingAddress;

                if (!shippingAddress) {
                    shippingAddress = shipment.createShippingAddress();
                }

                shippingAddress.setFirstName(address.firstName || '');
                shippingAddress.setLastName(address.lastName || '');
                shippingAddress.setAddress1(address.address1 || '');
                shippingAddress.setAddress2(address.address2 || '');
                shippingAddress.setCity(address.city || '');
                shippingAddress.setPostalCode(address.postalCode || '');
                shippingAddress.setStateCode(address.stateCode || '');
                shippingAddress.setCountryCode(address.countryCode || '');
                shippingAddress.setPhone(address.phone || '');

                ShippingHelper.selectShippingMethod(shipment, shippingMethodID);

                basketCalculationHelpers.calculateTotals(currentBasket);
            });
        } catch (err) {
            res.setStatusCode(500);
            res.json({
                error: true,
                errorMessage: Resource.msg('error.cannot.select.shipping.method', 'cart', null)
            });

            return;
        }

        COHelpers.setGift(shipment, shippingData.isGift, shippingData.giftMessage);

        var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
        var currentLocale = Locale.getLocale(req.locale.id);

        var basketModel = new OrderModel(
            currentBasket,
            { usingMultiShipping: usingMultiShipping, countryCode: currentLocale.country, containerView: 'basket' }
        );

        res.json({
            customer: new AccountModel(req.currentCustomer),
            order: basketModel
        });
    });

    return next();
});


server.post('UpdateShippingMethodsList', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Transaction = require('dw/system/Transaction');
    var AccountModel = require('*/cartridge/models/account');
    var OrderModel = require('*/cartridge/models/order');
    var URLUtils = require('dw/web/URLUtils');
    var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
    var Locale = require('dw/util/Locale');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.json({
            error: true,
            cartError: true,
            fieldErrors: [],
            serverErrors: [],
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return next();
    }

    var shipmentUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;
    var shipment;
    if (shipmentUUID) {
        shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipmentUUID);
    } else {
        shipment = currentBasket.defaultShipment;
    }

    var address = ShippingHelper.getAddressFromRequest(req);

    var shippingMethodID;

    if (shipment.shippingMethod) {
        shippingMethodID = shipment.shippingMethod.ID;
    }

    Transaction.wrap(function () {
        var shippingAddress = shipment.shippingAddress;

        if (!shippingAddress) {
            shippingAddress = shipment.createShippingAddress();
        }

        Object.keys(address).forEach(function (key) {
            var value = address[key];
            if (value) {
                shippingAddress[key] = value;
            } else {
                shippingAddress[key] = null;
            }
        });

        ShippingHelper.selectShippingMethod(shipment, shippingMethodID);

        basketCalculationHelpers.calculateTotals(currentBasket);
    });

    var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
    var currentLocale = Locale.getLocale(req.locale.id);

    var basketModel = new OrderModel(
        currentBasket,
        { usingMultiShipping: usingMultiShipping, countryCode: currentLocale.country, containerView: 'basket' }
    );

    res.json({
        customer: new AccountModel(req.currentCustomer),
        order: basketModel,
        shippingForm: server.forms.getForm('shipping')
    });

    return next();
});


/**
 * Handle Ajax shipping form submit
 */
server.post(
    'SubmitShipping',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var URLUtils = require('dw/web/URLUtils');
        var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
        var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');

        var currentBasket = BasketMgr.getCurrentBasket();
        var validatedProducts = validationHelpers.validateProducts(currentBasket);
        if (!currentBasket || validatedProducts.error) {
            res.json({
                error: true,
                cartError: true,
                fieldErrors: [],
                serverErrors: [],
                redirectUrl: URLUtils.url('Cart-Show').toString()
            });
            return next();
        }

        var form = server.forms.getForm('shipping');
        var result = {};

        // verify shipping form data
        var shippingFormErrors = COHelpers.validateShippingForm(form.shippingAddress.addressFields);

        if (Object.keys(shippingFormErrors).length > 0) {
            req.session.privacyCache.set(currentBasket.defaultShipment.UUID, 'invalid');

            res.json({
                form: form,
                fieldErrors: [shippingFormErrors],
                serverErrors: [],
                error: true
            });
        } else {
            req.session.privacyCache.set(currentBasket.defaultShipment.UUID, 'valid');

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

            result.shippingMethod = form.shippingAddress.shippingMethodID.value
                ? form.shippingAddress.shippingMethodID.value.toString()
                : null;

            result.isGift = form.shippingAddress.isGift.checked;

            result.giftMessage = result.isGift ? form.shippingAddress.giftMessage.value : null;

            res.setViewData(result);

            this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
                var AccountModel = require('*/cartridge/models/account');
                var OrderModel = require('*/cartridge/models/order');
                var Locale = require('dw/util/Locale');

                var shippingData = res.getViewData();

                COHelpers.copyShippingAddressToShipment(
                    shippingData,
                    currentBasket.defaultShipment
                );

                var giftResult = COHelpers.setGift(
                    currentBasket.defaultShipment,
                    shippingData.isGift,
                    shippingData.giftMessage
                );

                if (giftResult.error) {
                    res.json({
                        error: giftResult.error,
                        fieldErrors: [],
                        serverErrors: [giftResult.errorMessage]
                    });
                    return;
                }

                if (!currentBasket.billingAddress) {
                    if (req.currentCustomer.addressBook
                        && req.currentCustomer.addressBook.preferredAddress) {
                        // Copy over preferredAddress (use addressUUID for matching)
                        COHelpers.copyBillingAddressToBasket(
                            req.currentCustomer.addressBook.preferredAddress, currentBasket);
                    } else {
                        // Copy over first shipping address (use shipmentUUID for matching)
                        COHelpers.copyBillingAddressToBasket(
                            currentBasket.defaultShipment.shippingAddress, currentBasket);
                    }
                }
                var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
                if (usingMultiShipping === true && currentBasket.shipments.length < 2) {
                    req.session.privacyCache.set('usingMultiShipping', false);
                    usingMultiShipping = false;
                }

                COHelpers.recalculateBasket(currentBasket);

                var currentLocale = Locale.getLocale(req.locale.id);
                var basketModel = new OrderModel(
                    currentBasket,
                    {
                        usingMultiShipping: usingMultiShipping,
                        shippable: true,
                        countryCode: currentLocale.country,
                        containerView: 'basket'
                    }
                );

                res.json({
                    customer: new AccountModel(req.currentCustomer),
                    order: basketModel,
                    form: server.forms.getForm('shipping')
                });
            });
        }

        return next();
    }
);


module.exports = server.exports();
