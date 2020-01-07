'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../mocks/dw.util.Collection');

function createBasket(shipments) {
    return {
        getShipments: function () {
            return new ArrayList(shipments);
        }
    };
}

function createShipment(lineItems, address) {
    return {
        shippingAddress: address,
        getAllLineItems: function () {
            return new ArrayList(lineItems);
        }
    };
}

function createLineItem(shipment, taxClassId, uuid) {
    return {
        lineItemText: '',
        taxClassID: taxClassId,
        taxRate: 1,
        UUID: uuid
    };
}

var failTaxJurisdictionID = false;
var failTaxClassID = false;

describe('Taxes', function () {
    var taxesHook = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/hooks/taxes', {
        'dw/order/ShippingLocation': function () {
            return {};
        },
        'dw/order/TaxMgr': {
            getTaxJurisdictionID: function () {
                return 2;
            },
            get defaultTaxJurisdictionID() {
                if (failTaxJurisdictionID) {
                    return null;
                }
                return 1;
            },
            customRateTaxClassID: 'custom',
            get defaultTaxClassID() {
                if (failTaxClassID) {
                    return null;
                }
                return 1;
            },
            getTaxRate: function (classId, jurisdictionId) {
                if (classId === -1) {
                    return null;
                }
                return classId / jurisdictionId;
            }
        },
        '*/cartridge/scripts/util/collections': proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
            'dw/util/ArrayList': ArrayList
        }),
        'dw/system/Logger': {
            debug: function (text) {
                return text;
            },
            error: function (text) {
                return text;
            }
        }
    });

    it('should calculate taxes for simple basket with a single line item', function () {
        var basket = createBasket([createShipment([createLineItem(false, 0.5, 'id')], 'address')]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;

        assert.equal(taxes.length, 1);
        assert.equal(taxes[0].uuid, 'id');
        assert.equal(taxes[0].value, 0.25);
    });

    it('should calculate taxes for basket with multiple line items', function () {
        var basket = createBasket([createShipment([createLineItem(false, 0.5, 'id'), createLineItem(false, 2, 'id2')], 'address')]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;

        assert.equal(taxes.length, 2);
        assert.equal(taxes[0].uuid, 'id');
        assert.equal(taxes[0].value, 0.25);
        assert.equal(taxes[1].uuid, 'id2');
        assert.equal(taxes[1].value, 1);
    });

    it('should skip taxes for line items with custom rate', function () {
        var basket = createBasket([createShipment([createLineItem(false, 'custom', 'id')], 'address')]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;

        assert.equal(taxes.length, 0);
    });

    it('should use default taxJurisdictionID if there is no address', function () {
        var basket = createBasket([createShipment([createLineItem(false, 2, 'id')], null)]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;

        assert.equal(taxes.length, 1);
        assert.equal(taxes[0].value, 2);
    });

    it('should not return taxes if taxJurisdictionId cannot be retrieved', function () {
        failTaxJurisdictionID = true;
        var basket = createBasket([createShipment([createLineItem(false, 2, 'id')], null)]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;
        failTaxJurisdictionID = false;

        assert.equal(taxes.length, 0);
    });

    it('should use default taxClass if one is not provided', function () {
        var basket = createBasket([createShipment([createLineItem(false, null, 'id')], 'address')]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;

        assert.equal(taxes.length, 1);
        assert.equal(taxes[0].value, 0.5);
    });

    it('should not return taxes if taxRate cannot be calculated', function () {
        var basket = createBasket([createShipment([createLineItem(false, -1, 'id')], 'address')]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;

        assert.equal(taxes.length, 0);
    });

    it('should not return taxes if taxClassID cannot be retrieved', function () {
        failTaxClassID = true;
        var basket = createBasket([createShipment([createLineItem(false, null, 'id')], null)]);
        var taxResult = taxesHook.calculateTaxes(basket);
        var taxes = taxResult.taxes;
        failTaxClassID = false;

        assert.equal(taxes.length, 0);
    });

    it('should return custom properties', function () {
        var basket = createBasket([createShipment([createLineItem(false, -1, 'id')], 'address')]);
        var taxResult = taxesHook.calculateTaxes(basket);

        assert.isObject(taxResult.custom);
    });
});
