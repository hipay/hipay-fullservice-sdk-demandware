'use strict';

var assert = require('chai').assert;
var Content = require('../../../../cartridges/app_storefront_base/cartridge/models/content');

describe('Content', function () {
    it('should return converted content model', function () {
        var contentValue = {
            custom: {
                body: 'Hello'
            },
            name: 'contentAssetName',
            template: 'templateName',
            UUID: 22,
            ID: 'contentAssetID',
            online: true,
            pageTitle: 'some title',
            pageDescription: 'some description',
            pageKeywords: 'some keywords',
            pageMetaTags: [{}]
        };

        var content = new Content(contentValue);

        assert.deepEqual(content, {
            body: 'Hello',
            name: 'contentAssetName',
            template: 'templateName',
            ID: 'contentAssetID',
            UUID: 22,
            pageTitle: 'some title',
            pageDescription: 'some description',
            pageKeywords: 'some keywords',
            pageMetaTags: [{}]
        });
    });

    it('should return converted content model without a body', function () {
        var contentValue = {
            name: 'contentAssetName',
            template: 'templateName',
            UUID: 22,
            online: true
        };

        var content = new Content(contentValue);

        assert.isNull(content.body);
    });

    it('should return converted content model with null for a body', function () {
        var contentValue = {
            custom: {},
            name: 'contentAssetName',
            template: 'templateName',
            UUID: 22,
            online: true
        };

        var content = new Content(contentValue);

        assert.isNull(content.body);
    });

    it('should return converted content model with default template', function () {
        var contentValue = {
            custom: { body: 'Hello' },
            name: 'contentAssetName',
            UUID: 22,
            online: true
        };

        var content = new Content(contentValue);

        assert.equal(content.template, 'components/content/contentAssetInc');
    });

    it('should return undefined for the body if online flag is false', function () {
        var contentValue = {
            custom: { body: 'Hello' },
            name: 'contentAssetName',
            UUID: 22,
            online: false
        };

        var content = new Content(contentValue);

        assert.isUndefined(content.body);
    });
});
