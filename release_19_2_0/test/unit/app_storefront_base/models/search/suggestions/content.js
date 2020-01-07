'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');


describe('Content Suggestions model', function () {
    var nextSuggestionStub = sinon.stub();
    var urlStub = sinon.stub();
    var ContentSuggestions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/suggestions/content.js', {
        'dw/web/URLUtils': {
            url: urlStub
        }
    });
    var content1 = {
        content: {
            name: 'Content 1',
            ID: 1
        }
    };
    var content2 = {
        content: {
            name: 'Content 2',
            ID: 2
        }
    };
    var content3 = {
        content: {
            name: 'Content 3',
            ID: 3
        }
    };

    urlStub.onCall(0).returns('url1');
    urlStub.onCall(1).returns('url2');
    urlStub.onCall(2).returns('url3');

    nextSuggestionStub.onCall(0).returns(content1);
    nextSuggestionStub.onCall(1).returns(content2);
    nextSuggestionStub.onCall(2).returns(content3);

    it('should produce a ContentSuggestions instance', function () {
        var suggestions = {
            contentSuggestions: {
                suggestedContent: {
                    next: nextSuggestionStub,
                    hasNext: function () { return true; }
                },
                hasSuggestions: function () { return true; }
            }
        };

        var contentSuggestions = new ContentSuggestions(suggestions, 3);

        assert.deepEqual(contentSuggestions, {
            available: true,
            contents: [{
                name: 'Content 1',
                url: 'url1'
            }, {
                name: 'Content 2',
                url: 'url2'
            }, {
                name: 'Content 3',
                url: 'url3'
            }]
        });
    });
});
