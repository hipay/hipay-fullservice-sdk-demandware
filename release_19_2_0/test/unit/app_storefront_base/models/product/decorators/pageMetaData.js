'use strict';

var assert = require('chai').assert;

var productModelMock = {
    pageTitle: 'some title',
    pageDescription: 'some description',
    pageKeywords: 'some keywords',
    pageMetaTags: [{}]
};

describe('product pageMetaData decorator', function () {
    var pageMetaData = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/pageMetaData');

    it('should create pageTitle property for passed in object', function () {
        var object = {};
        pageMetaData(object, productModelMock);

        assert.equal(object.pageTitle, 'some title');
    });

    it('should create pageDescription property for passed in object', function () {
        var object = {};
        pageMetaData(object, productModelMock);

        assert.equal(object.pageDescription, 'some description');
    });

    it('should create pageKeywords property for passed in object', function () {
        var object = {};
        pageMetaData(object, productModelMock);

        assert.equal(object.pageKeywords, 'some keywords');
    });

    it('should create pageMetaTags property for passed in object', function () {
        var object = {};
        pageMetaData(object, productModelMock);

        assert.deepEqual(object.pageMetaTags, [{}]);
    });
});
