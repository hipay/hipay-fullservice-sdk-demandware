'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var stubGetImage = sinon.stub();

var representedVariationValuesMock = {
    getImage: stubGetImage,
    value: 'someColor',
    ID: 'someColorID',
    description: 'someDescription',
    displayValue: 'someDisplayValue'
};

var searchHitMock = {
    getRepresentedVariationValues: function () {
        return new ArrayList([representedVariationValuesMock]);
    }
};

describe('search variation attributes decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var variationAttributes = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/searchVariationAttributes', {
        '*/cartridge/scripts/util/collections': collections,
        'dw/web/URLUtils': {
            url: function () {
                return 'someURL';
            }
        }
    });

    it('should create a property on the passed in object called variationAttributes', function () {
        var object = {};
        stubGetImage.returns({
            alt: 'alt',
            URL: {
                toString: function () {
                    return 'string url';
                }
            },
            title: 'someTitle'
        });
        variationAttributes(object, searchHitMock);

        assert.equal(object.variationAttributes.length, 1);
        assert.equal(object.variationAttributes[0].attributeId, 'color');
        assert.equal(object.variationAttributes[0].id, 'color');
        assert.isTrue(object.variationAttributes[0].swatchable);
        assert.equal(object.variationAttributes[0].values.length, 1);
        assert.equal(object.variationAttributes[0].values[0].id, 'someColorID');
        assert.equal(object.variationAttributes[0].values[0].description, 'someDescription');
        assert.equal(object.variationAttributes[0].values[0].displayValue, 'someDisplayValue');
        assert.equal(object.variationAttributes[0].values[0].value, 'someColor');
        assert.isTrue(object.variationAttributes[0].values[0].selectable);
        assert.isTrue(object.variationAttributes[0].values[0].selected);
        assert.equal(object.variationAttributes[0].values[0].images.swatch[0].alt, 'alt');
        assert.equal(object.variationAttributes[0].values[0].images.swatch[0].url, 'string url');
        assert.equal(object.variationAttributes[0].values[0].images.swatch[0].title, 'someTitle');
        assert.equal(object.variationAttributes[0].values[0].url, 'someURL');
    });

    it('should handle no images returned by the api for represented variation values', function () {
        var object = {};
        stubGetImage.returns(null);
        variationAttributes(object, searchHitMock);

        assert.equal(object.variationAttributes.length, 1);
        assert.deepEqual(object.variationAttributes[0].values[0], {});
    });
});
