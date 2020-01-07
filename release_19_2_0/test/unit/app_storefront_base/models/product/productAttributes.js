'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../mocks/dw.util.Collection');
var toProductMock = require('../../../../util');

describe('productAttributes', function () {
    var ProductAttributes = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/productAttributes', {
        '*/cartridge/models/product/productImages': function () {},
        '*/cartridge/scripts/util/collections': proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
            'dw/util/ArrayList': ArrayList
        }),
        '*/cartridge/scripts/helpers/urlHelpers': { appendQueryParams: function () {
            return '?pid=25604524&dwvar_25604524_size=038&dwvar_25604524_color=BLACKFB';
        } }
    });

    var variationsMock = {
        productVariationAttributes: new ArrayList([]),
        getSelectedValue: {
            return: {
                equals: {
                    return: true,
                    type: 'function'
                }
            },
            type: 'function'
        },
        getAllValues: {
            return: new ArrayList([]),
            type: 'function'
        },
        hasOrderableVariants: {
            return: false,
            type: 'function'
        },
        urlUnselectVariationValue: {
            return: 'unselect_url',
            type: 'function'
        },
        urlSelectVariationValue: {
            return: 'select_url',
            type: 'function'
        }
    };

    it('should return empty array if product doesn not have attributes', function () {
        var mock = toProductMock(variationsMock);
        var attributeConfig = {
            attributes: ['color'],
            endPoint: 'Show'
        };
        var attrs = new ProductAttributes(mock, attributeConfig);

        assert.equal(attrs.length, 0);
    });

    it('should return color attributes', function () {
        var tempMock = Object.assign({}, variationsMock);
        tempMock.productVariationAttributes = new ArrayList([{
            attributeID: 'color',
            displayName: 'color',
            ID: 'COLOR_ID'
        }]);
        var mock = toProductMock(tempMock);
        var attributeConfig = {
            attributes: ['color'],
            endPoint: 'Show'
        };
        var attrs = new ProductAttributes(mock, attributeConfig);

        assert.equal(attrs.length, 1);
        assert.equal(attrs[0].displayName, 'color');
        assert.equal(attrs[0].attributeId, 'color');
        assert.equal(attrs[0].id, 'COLOR_ID');
        assert.isTrue(attrs[0].swatchable);
        assert.equal(attrs[0].values.length, 0);
    });

    it('should return color attributes with multiple values', function () {
        var tempMock = Object.assign({}, variationsMock);
        tempMock.productVariationAttributes = new ArrayList([{
            attributeID: 'color',
            displayName: 'color',
            ID: 'COLOR_ID'
        }, {
            attributeID: 'size',
            displayName: 'size',
            ID: 'SIZE_ID'
        }]);
        tempMock.getAllValues.return = new ArrayList([{
            ID: 'asdfa9s87sad',
            description: '',
            displayValue: 'blue',
            value: 'asdfa9s87sad'
        }, {
            ID: 'asd98f7asdf',
            description: '',
            displayValue: 'grey',
            value: 'asd98f7asdf'
        }]);
        var mock = toProductMock(tempMock);
        var attributeConfig = {
            attributes: ['color'],
            endPoint: 'Show'
        };
        var attrs = new ProductAttributes(mock, attributeConfig);

        assert.equal(attrs.length, 1);
        assert.equal(attrs[0].displayName, 'color');
        assert.equal(attrs[0].values.length, 2);
        assert.equal(attrs[0].values[0].displayValue, 'blue');
        assert.equal(attrs[0].values[1].displayValue, 'grey');
    });

    it('should return size attributes with multiple values', function () {
        var tempMock = Object.assign({}, variationsMock);
        tempMock.productVariationAttributes = new ArrayList([{
            attributeID: 'color',
            displayName: 'color',
            ID: 'COLOR_ID'
        }, {
            attributeID: 'size',
            displayName: 'size',
            ID: 'SIZE_ID'
        }]);
        tempMock.getAllValues.return = new ArrayList([{
            ID: '038',
            description: '',
            displayValue: '38',
            value: '038'
        }, {
            ID: '039',
            description: '',
            displayValue: '39',
            value: '039'
        }]);
        var mock = toProductMock(tempMock);
        var attributeConfig = {
            attributes: ['size'],
            endPoint: 'Show'
        };
        var attrs = new ProductAttributes(mock, attributeConfig);

        assert.equal(attrs.length, 1);
        assert.equal(attrs[0].displayName, 'size');
        assert.equal(attrs[0].values.length, 2);
        assert.equal(attrs[0].values[0].displayValue, '38');
        assert.equal(attrs[0].values[1].displayValue, '39');
    });

    it('should return size attributes with a resetUrl', function () {
        var tempMock = Object.assign({}, variationsMock);

        tempMock.productVariationAttributes = new ArrayList([{
            attributeID: 'color',
            displayName: 'color',
            ID: 'color'
        }, {
            attributeID: 'size',
            displayName: 'size',
            ID: 'size',
            resetUrl: ''
        }]);

        tempMock.getAllValues.return = new ArrayList([{
            ID: '038',
            description: '',
            displayValue: '38',
            value: '038',
            selectable: true,
            selected: false,
            url: 'attrID=something'
        }, {
            ID: '039',
            description: '',
            displayValue: '39',
            value: '039',
            selectable: true,
            selected: false,
            url: 'attrID=something'

        }]);

        tempMock.getSelectedValue.return = false;
        tempMock.hasOrderableVariants.return = true;
        tempMock.urlSelectVariationValue.return = '?pid=25604524&dwvar_25604524_size=038&dwvar_25604524_color=BLACKFB';

        var mock = toProductMock(tempMock);
        var attributeConfig = {
            attributes: ['size'],
            endPoint: 'Show'
        };
        var attrs = new ProductAttributes(mock, attributeConfig);

        assert.equal(attrs[0].resetUrl, '?pid=25604524&dwvar_25604524_size=&dwvar_25604524_color=BLACKFB');
    });

    it('should return all atributes when using "*" as the attributeConfig', function () {
        var tempMock = Object.assign({}, variationsMock);

        tempMock.productVariationAttributes = new ArrayList([{
            attributeID: 'color',
            displayName: 'color',
            ID: 'color'
        }, {
            attributeID: 'size',
            displayName: 'size',
            ID: 'size',
            resetUrl: ''
        }, {
            attributeID: 'width',
            displayName: 'width',
            ID: 'width',
            resetUrl: ''
        }]);

        tempMock.getAllValues.return = new ArrayList([{
            ID: '038',
            description: '',
            displayValue: '38',
            value: '038',
            selectable: true,
            selected: false,
            url: ''
        }, {
            ID: '039',
            description: '',
            displayValue: '39',
            value: '039',
            selectable: true,
            selected: false,
            url: ''

        }]);

        var attributeConfig = {
            attributes: '*',
            endPoint: 'Show'
        };

        tempMock.getSelectedValue.return = false;
        tempMock.hasOrderableVariants.return = true;
        tempMock.urlSelectVariationValue.return = '?pid=25604524&dwvar_25604524_size=038&dwvar_25604524_color=BLACKFB';

        var mock = toProductMock(tempMock);

        var attrs = new ProductAttributes(mock, attributeConfig);

        assert.equal(attrs.length, 3);
        assert.equal(attrs[0].id, 'color');
        assert.equal(attrs[1].id, 'size');
        assert.equal(attrs[2].id, 'width');
    });

    it('should return a subset of properties per attribute when attributeConfig.attributes = "selected"', function () {
        var tempMock = Object.assign({}, variationsMock);

        tempMock.productVariationAttributes = new ArrayList([{
            attributeID: 'color',
            displayName: 'color',
            displayValue: '',
            ID: 'color'
        }]);

        var attributeConfig = {
            attributes: 'selected'
        };

        tempMock.getSelectedValue = {
            return: {
                description: 'lorum ipsum',
                displayValue: 'Black',
                ID: 'BlackFB',
                value: 'BlackFB',
                equals: {
                    return: true,
                    type: 'function'
                }
            },
            type: 'function'
        };

        tempMock.hasOrderableVariants.return = true;

        var mock = toProductMock(tempMock);

        var attrs = new ProductAttributes(mock, attributeConfig);

        assert.equal(attrs.length, 1);
        assert.isDefined(attrs[0].attributeId);
        assert.isDefined(attrs[0].displayName);
        assert.isDefined(attrs[0].displayValue);
        assert.equal(attrs[0].displayValue, 'Black');
        assert.isDefined(attrs[0].id);

        assert.isUndefined(attrs[0].swatchable);
        assert.isUndefined(attrs[0].values);
        assert.isUndefined(attrs[0].resetUrl);
    });
});
