'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../mocks/dw.util.Collection');
var toProductMock = require('../../../../util');

describe('productImages', function () {
    var ProductImages = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/productImages', {
        '*/cartridge/scripts/util/collections': proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
            'dw/util/ArrayList': ArrayList
        })
    });

    var productMock = {
        getImages: {
            return: new ArrayList([{
                alt: 'First Image',
                title: 'First Image',
                URL: {
                    toString: function () {
                        return '/first_image_url';
                    }
                },
                absURL: {
                    toString: function () {
                        return '/first_image_url';
                    }
                }
            }, {
                alt: 'Second Image',
                title: 'Second Image',
                URL: {
                    toString: function () {
                        return '/second_image_url';
                    }
                },
                absURL: {
                    toString: function () {
                        return '/first_image_url';
                    }
                }
            }]),
            type: 'function'
        }
    };

    it('should get all small images', function () {
        var images = new ProductImages(toProductMock(productMock), { types: ['small'], quantity: '*' });
        assert.equal(images.small.length, 2);
        assert.equal(images.small[0].alt, 'First Image');
        assert.equal(images.small[0].title, 'First Image');
        assert.equal(images.small[0].url, '/first_image_url');
        assert.equal(images.small[1].url, '/second_image_url');
    });

    it('should get only first small image', function () {
        var images = new ProductImages(toProductMock(productMock), { types: ['small'], quantity: 'single' });
        assert.equal(images.small.length, 1);
        assert.equal(images.small[0].alt, 'First Image');
        assert.equal(images.small[0].title, 'First Image');
        assert.equal(images.small[0].url, '/first_image_url');
    });
});
