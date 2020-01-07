'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var attributeModel = {
    visibleAttributeGroups: new ArrayList([{
        ID: 'some ID',
        displayName: 'some name'
    }]),
    getVisibleAttributeDefinitions: function () {
        return new ArrayList([{
            multiValueType: false,
            displayName: 'some name'
        }]);
    },
    getDisplayValue: function () {
        return 'some value';
    }
};

var multiValueTypeAttribute = {
    visibleAttributeGroups: new ArrayList([{
        ID: 'some ID',
        displayName: 'some name'
    }]),
    getVisibleAttributeDefinitions: function () {
        return new ArrayList([{
            multiValueType: true,
            displayName: 'some name'
        }]);
    },
    getDisplayValue: function () {
        return [1, 2, 3];
    }
};

describe('product attributes decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var attributes = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/attributes', {
        '*/cartridge/scripts/util/collections': collections
    });

    it('should create a property on the passed in object called attributes', function () {
        var object = {};
        attributes(object, attributeModel);

        assert.equal(object.attributes.length, 1);
        assert.equal(object.attributes[0].ID, 'some ID');
        assert.equal(object.attributes[0].name, 'some name');
        assert.equal(object.attributes[0].attributes.length, 1);
    });

    it('should handle no visible attribute groups', function () {
        var object = {};
        attributeModel.visibleAttributeGroups = new ArrayList([]);
        attributes(object, attributeModel);

        assert.equal(object.attributes, null);
    });

    it('should handle multi value type attribute definition', function () {
        var object = {};
        attributes(object, multiValueTypeAttribute);

        assert.equal(object.attributes.length, 1);
        assert.equal(object.attributes[0].ID, 'some ID');
        assert.equal(object.attributes[0].name, 'some name');
        assert.equal(object.attributes[0].attributes.length, 1);
        assert.equal(object.attributes[0].attributes[0].label, 'some name');
        assert.equal(object.attributes[0].attributes[0].value.length, 3);
    });
});
