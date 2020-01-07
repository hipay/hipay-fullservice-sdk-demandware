'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');

var ArrayList = require('../../../../../mocks/dw.util.Collection');

var stubRangePrice = sinon.stub();
var stubDefaultPrice = sinon.stub();
var stubPriceModel = sinon.stub();
var stubRootPriceBook = sinon.stub();

var pricModelMock = {
    priceInfo: {
        priceBook: { ID: 'somePriceBook' }
    }
};

var searchHitMock = {
    minPrice: { value: 100 },
    maxPrice: { value: 100 },
    firstRepresentedProduct: {
        ID: 'someProduct',
        getPriceModel: stubPriceModel
    },
    discountedPromotionIDs: ['someID']
};

var noActivePromotionsMock = [];
var activePromotionsMock = ['someID'];
var activePromotionsNoMatchMock = ['someOtherID'];

function getSearchHit() {
    return searchHitMock;
}

describe('search price decorator', function () {
    var searchPrice = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/searchPrice', {
        'dw/campaign/PromotionMgr': {
            getPromotion: function () {
                return {};
            }
        },
        'dw/util/ArrayList': ArrayList,
        '*/cartridge/scripts/helpers/pricing': {
            getRootPriceBook: stubRootPriceBook,
            getPromotionPrice: function () { return { value: 50 }; }
        },
        'dw/catalog/PriceBookMgr': {
            setApplicablePriceBooks: function () {}
        },
        '*/cartridge/models/price/default': stubDefaultPrice,
        '*/cartridge/models/price/range': stubRangePrice
    });

    afterEach(function () {
        stubRangePrice.reset();
        stubDefaultPrice.reset();
    });

    it('should create a property on the passed in object called price', function () {
        var object = {};
        stubPriceModel.returns(pricModelMock);
        stubRootPriceBook.returns({ ID: 'someOtherPriceBook' });
        searchPrice(object, searchHitMock, noActivePromotionsMock, getSearchHit);

        assert.isTrue(stubDefaultPrice.withArgs({ value: 100 }).calledOnce);
    });

    it('should create a property on the passed in object called price', function () {
        var object = {};
        stubPriceModel.returns(pricModelMock);
        stubRootPriceBook.returns({ ID: 'someOtherPriceBook' });
        searchPrice(object, searchHitMock, activePromotionsNoMatchMock, getSearchHit);

        assert.isTrue(stubDefaultPrice.withArgs({ value: 100 }).calledOnce);
    });

    it('should create a property on the passed in object called price', function () {
        var object = {};
        stubPriceModel.returns(pricModelMock);
        stubRootPriceBook.returns({ ID: 'someOtherPriceBook' });
        searchPrice(object, searchHitMock, activePromotionsMock, getSearchHit);

        assert.isTrue(stubDefaultPrice.withArgs({ value: 50 }, { value: 100 }).calledOnce);
    });

    // ==========
    it('should create a property on the passed in object called price', function () {
        var object = {};
        stubPriceModel.returns({});
        stubRootPriceBook.returns({ ID: 'someOtherPriceBook' });
        searchPrice(object, searchHitMock, activePromotionsMock, getSearchHit);

        assert.isTrue(stubDefaultPrice.withArgs({ value: 50 }).calledOnce);
    });

    it('should create a property on the passed in object called price', function () {
        var object = {};
        stubPriceModel.returns(pricModelMock);
        stubRootPriceBook.returns({ ID: 'somePriceBook' });
        searchPrice(object, searchHitMock, activePromotionsMock, getSearchHit);

        assert.isTrue(stubDefaultPrice.withArgs({ value: 50 }).calledOnce);
    });
    // ==========

    it('should create a property on the passed in object called price', function () {
        var object = {};
        stubPriceModel.returns(pricModelMock);
        stubRootPriceBook.returns({ ID: 'someOtherPriceBook' });
        searchHitMock.maxPrice.value = 200;
        searchPrice(object, searchHitMock, noActivePromotionsMock, getSearchHit);

        assert.isTrue(stubRangePrice.withArgs({ value: 100 }, { value: 200 }).calledOnce);
    });
});
