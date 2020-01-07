'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var mockCollections = require('../../../../mocks/util/collections');
var sinon = require('sinon');


describe('Tiered Price Model', function () {
    function MockQuantity(qty) {
        this.getValue = function () { return qty; };
    }

    var tierValues = {
        '1-5': '$20',
        '6-10': '$10'
    };
    var tierQty = Object.keys(tierValues);
    var stubDefaultPrice = sinon.stub();
    var firstTierPrice = { sales: tierValues[tierQty[0]] };
    var secondTierPrice = { sales: tierValues[tierQty[1]] };
    stubDefaultPrice.onCall(0).returns(firstTierPrice);
    stubDefaultPrice.onCall(1).returns(secondTierPrice);

    var priceTable = {
        getQuantities: function () {
            return Object.keys(tierValues).map(function (qty) {
                return new MockQuantity(qty);
            });
        },
        getPrice: function (qty) {
            return tierValues[qty.getValue()];
        }
    };
    var TieredPrice = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/price/tiered.js', {
        '*/cartridge/scripts/util/collections': { map: mockCollections.map },
        '*/cartridge/models/price/default': stubDefaultPrice
    });

    afterEach(function () {
        stubDefaultPrice.reset();
    });

    it('should set startingFromPrice to the first tier price', function () {
        var tieredPrice = new TieredPrice(priceTable);
        assert.equal(tieredPrice.startingFromPrice, firstTierPrice);
    });

    it('should set a tier to its proper quantity/price pairing', function () {
        var tieredPrice = new TieredPrice(priceTable);
        assert.equal(tieredPrice.tiers[1].quantity, tierQty[1]);
        assert.equal(tieredPrice.tiers[1].price, secondTierPrice);
    });

    it('should have type property value of "tiered"', function () {
        var tieredPrice = new TieredPrice(priceTable);
        assert.equal(tieredPrice.type, 'tiered');
    });

    it('should set useSimplePrice to false by default', function () {
        var tieredPrice = new TieredPrice(priceTable);
        assert.equal(tieredPrice.useSimplePrice, false);
    });

    it('should set useSimplePrice to true when provided', function () {
        var tieredPrice = new TieredPrice(priceTable, true);
        assert.equal(tieredPrice.useSimplePrice, true);
    });
});
