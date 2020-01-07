'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');


describe('SearchPhrase Suggestions model', function () {
    var nextPhraseStub = sinon.stub();
    var urlStub = sinon.stub();
    var SearchPhraseSuggestions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/suggestions/searchPhrase.js', {
        'dw/web/URLUtils': {
            url: urlStub
        }
    });
    var phrase1 = {
        phrase: 'phrase 1'
    };
    var phrase2 = {
        phrase: 'phrase 2'
    };
    var phrase3 = {
        phrase: 'phrase 3'
    };

    urlStub.onCall(0).returns('url1');
    urlStub.onCall(1).returns('url2');
    urlStub.onCall(2).returns('url3');

    nextPhraseStub.onCall(0).returns(phrase1);
    nextPhraseStub.onCall(1).returns(phrase2);
    nextPhraseStub.onCall(2).returns(phrase3);

    afterEach(function () {
        urlStub.reset();
        nextPhraseStub.reset();
    });

    it('should produce a BrandSuggestions instance', function () {
        var suggestions = {
            brandSuggestions: {
                searchPhraseSuggestions: {
                    hasSuggestedPhrases: function () { return true; },
                    suggestedPhrases: {
                        hasNext: function () { return true; },
                        next: nextPhraseStub
                    }
                }
            }
        };
        var brandSuggestions = new SearchPhraseSuggestions(suggestions.brandSuggestions, 3);

        assert.deepEqual(brandSuggestions, {
            available: true,
            phrases: [{
                value: 'phrase 1',
                url: 'url1'
            }, {
                value: 'phrase 2',
                url: 'url2'
            }, {
                value: 'phrase 3',
                url: 'url3'
            }]
        });
    });
    it('should produce a RecentSuggestions instance', function () {
        var suggestions = {
            recentSearchPhrases: {
                hasNext: function () { return true; },
                next: nextPhraseStub
            }
        };

        var recentSuggestions = new SearchPhraseSuggestions(suggestions.recentSearchPhrases, 3);

        assert.deepEqual(recentSuggestions, {
            available: true,
            phrases: [{
                value: 'phrase 1',
                url: 'url1'
            }, {
                value: 'phrase 2',
                url: 'url2'
            }, {
                value: 'phrase 3',
                url: 'url3'
            }]
        });
    });
    it('should produce a PopularSuggestions instance', function () {
        var suggestions = {
            popularSearchPhrases: {
                hasNext: function () { return true; },
                next: nextPhraseStub
            }
        };

        var popularSuggestions = new SearchPhraseSuggestions(suggestions.popularSearchPhrases, 3);

        assert.deepEqual(popularSuggestions, {
            available: true,
            phrases: [{
                value: 'phrase 1',
                url: 'url1'
            }, {
                value: 'phrase 2',
                url: 'url2'
            }, {
                value: 'phrase 3',
                url: 'url3'
            }]
        });
    });
});
