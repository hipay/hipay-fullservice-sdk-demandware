'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var mockCollections = require('../../../mocks/util/collections');
var ArrayList = require('../../../mocks/dw.util.Collection');

describe('Reporting URLs', function () {
    var reportingUrls = proxyquire('../../../../cartridges/app_storefront_base/cartridge/scripts/reportingUrls', {
        'dw/util/StringUtils': {
            formatNumber: function () {
                return 'formatted number';
            },
            formatCalendar: function () {
                return 'formatted date';
            }
        },
        'dw/util/Calendar': function () { return {}; },
        'dw/web/URLUtils': {
            url: function () {
                return 'url';
            }
        },
        '*/cartridge/scripts/helpers/formatHelpers': proxyquire('../../../../cartridges/app_storefront_base/cartridge/scripts/helpers/formatHelpers', {
            'dw/util/StringUtils': {
                formatNumber: function () {
                    return 'formatted number';
                }
            }
        }),
        '*/cartridge/scripts/util/collections': mockCollections
    });

    var priceAdjustments = new ArrayList([{
        UUID: 'UUID',
        campaignID: 'some ID',
        promotionID: 'some ID',
        price: { value: 'some price' },
        isCustom: function () { return; },
        basedOnCoupon: false
    }]);

    var productLineItems = new ArrayList([{
        productID: 'product id',
        productName: 'product name',
        UUID: 'UUID',
        quantity: { value: 'quantity' },
        basePrice: { value: 'base price' },
        netPrice: { value: 'net price' },
        tax: { value: 'tax' },
        grossPrice: { value: 'gross price' },
        adjustedNetPrice: { value: 'adjusted Net Price' },
        adjustedTax: { value: 'adjustedTax' },
        adjustedGrossPrice: { value: 'adjustedGrossPrice' },
        manufacturerName: 'manufacturerName',
        bonusProductLineItem: 'bonusProductLineItem',
        priceAdjustments: priceAdjustments
    }]);

    var shipments = new ArrayList([{
        shippingPriceAdjustments: new ArrayList([{
            campaignID: 'some ID',
            promotionID: 'some ID',
            price: { value: 'some price' },
            isCustom: function () { return; },
            basedOnCoupon: true
        }]),
        productLineItems: productLineItems
    }]);

    var basket = {
        UUID: 'UUID',
        productLineItems: {
            length: 1
        },
        merchandizeTotalPrice: { value: 'some price' },
        getAdjustedMerchandizeTotalPrice: function () { return 'AdjMerchandizeTotal'; },
        shippingTotalPrice: { value: 'shippingTotalPrice' },
        adjustedShippingTotalPrice: { value: 'adjustedShippingTotalPrice' },
        priceAdjustments: priceAdjustments,
        shipments: shipments

    };

    var order = {
        currencyCode: 'US',
        createdBy: 'Someone',
        merchandizeTotalNetPrice: { value: 'merchandizeTotalNetPrice' },
        merchandizeTotalTax: { value: 'merchandizeTotalTax' },
        merchandizeTotalGrossPrice: { value: 'merchandizeTotalGrossPrice' },
        shippingTotalNetPrice: { value: 'shippingTotalNetPrice' },
        shippingTotalTax: { value: 'shippingTotalTax' },
        shippingTotalGrossPrice: { value: 'shippingTotalGrossPrice' },
        adjustedMerchandizeTotalNetPrice: { value: 'adjustedMerchandizeTotalNetPrice' },
        adjustedMerchandizeTotalTax: { value: 'adjustedMerchandizeTotalTax' },
        adjustedMerchandizeTotalGrossPrice: { value: 'adjustedMerchandizeTotalGrossPrice' },
        adjustedShippingTotalNetPrice: { value: 'adjustedShippingTotalNetPrice' },
        adjustedShippingTotalTax: { value: 'adjustedShippingTotalTax' },
        adjustedShippingTotalGrossPrice: { value: 'adjustedShippingTotalGrossPrice' },
        totalNetPrice: { value: 'totalNetPrice' },
        totalTax: { value: 'totalTax' },
        customer: {
            orderHistory: {
                orderCount: '10'
            }
        },
        totalGrossPrice: { value: 'totalGrossPrice' },
        priceAdjustments: new ArrayList([{
            campaignID: 'Some ID',
            promotionID: 'Some ID',
            price: {
                value: 'some price'
            },
            isCustom: function () { return; },
            basedOnCoupon: true
        }]),
        shipments: shipments
    };

    var productSearch = {
        searchKeywords: 'words',
        count: 1
    };

    it('should get order reporting URLs', function () {
        var result = reportingUrls.getOrderReportingURLs(order);
        assert.equal(result.length, 6);
    });

    it('should get order count reporting URLs', function () {
        var myReportingUrls = [];
        var result = reportingUrls.getOrderPlacedReportingURLs(order, myReportingUrls);
        assert.equal(result.length, 1);
    });

    it('should get basket open reporting URLs', function () {
        var result = reportingUrls.getBasketOpenReportingURLs(basket);
        assert.equal(result.length, 4);
    });

    it('should get product search reporting URLs', function () {
        var result = reportingUrls.getProductSearchReportingURLs(productSearch);
        assert.equal(result.length, 1);
    });

    it('should get checkout reporting URLs', function () {
        var result = reportingUrls.getCheckoutReportingURLs(basket.UUID, 1, 'someName');
        assert.equal(result.length, 1);
    });

    it('should get Account Open reporting URLs', function () {
        var result = reportingUrls.getAccountOpenReportingURLs(5);
        assert.equal(result.length, 1);
    });
});
