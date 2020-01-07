'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');


describe('Product Suggestions model', function () {
    var nextProductStub = sinon.stub();
    var nextPhraseStub = sinon.stub();
    var urlStub = sinon.stub();
    var ProductSuggestions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/suggestions/product.js', {
        'dw/web/URLUtils': { url: urlStub }
    });
    var variationModel = {
        defaultVariant: {
            getImage: function () {
                return {
                    URL: {
                        toString: function () { return 'image url'; }
                    }
                };
            }
        }
    };
    var product1 = {
        productSearchHit: {
            product: {
                name: 'Content 1',
                ID: 1,
                master: true,
                variationModel: variationModel
            }
        }
    };
    var product2 = {
        productSearchHit: {
            product: {
                name: 'Content 2',
                ID: 2,
                master: true,
                variationModel: variationModel
            }
        }
    };
    var product3 = {
        productSearchHit: {
            product: {
                name: 'Content 3',
                ID: 3,
                master: true,
                variationModel: variationModel
            }
        }
    };
    var phrase1 = {
        exactMatch: true,
        phrase: 'phrase 1'
    };
    var phrase2 = {
        exactMatch: true,
        phrase: 'phrase 2'
    };
    var phrase3 = {
        exactMatch: true,
        phrase: 'phrase 3'
    };

    urlStub.onCall(0).returns('url1');
    urlStub.onCall(1).returns('url2');
    urlStub.onCall(2).returns('url3');

    nextProductStub.onCall(0).returns(product1);
    nextProductStub.onCall(1).returns(product2);
    nextProductStub.onCall(2).returns(product3);

    nextPhraseStub.onCall(0).returns(phrase1);
    nextPhraseStub.onCall(1).returns(phrase2);
    nextPhraseStub.onCall(2).returns(phrase3);

    it('should product a ProductSuggestions instance', function () {
        var suggestions = {
            productSuggestions: {
                searchPhraseSuggestions: {
                    suggestedPhrases: {
                        hasNext: function () { return true; },
                        next: nextPhraseStub
                    }
                },
                suggestedProducts: {
                    hasNext: function () { return true; },
                    next: nextProductStub
                },
                hasSuggestions: function () { return true; }
            }
        };

        var productSuggestions = new ProductSuggestions(suggestions, 3);

        assert.deepEqual(productSuggestions, {
            available: true,
            phrases: [{
                exactMatch: true,
                value: 'phrase 1'
            }, {
                exactMatch: true,
                value: 'phrase 2'
            }, {
                exactMatch: true,
                value: 'phrase 3'
            }],
            products: [{
                imageUrl: 'image url',
                name: 'Content 1',
                url: 'url1'
            }, {
                imageUrl: 'image url',
                name: 'Content 2',
                url: 'url2'
            }, {
                imageUrl: 'image url',
                name: 'Content 3',
                url: 'url3'
            }]
        });
    });
});
