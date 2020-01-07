'use strict';

var assert = require('chai').assert;
var StoreModel = require('../../../mocks/models/store');

var createStoreObject = function () {
    return {
        ID: 'Any ID',
        name: 'Downtown TV Shop',
        address1: '333 Washington St',
        address2: '',
        city: 'Boston',
        postalCode: '02108',
        phone: '333-333-3333',
        stateCode: 'MA',
        countryCode: {
            value: 'us'
        },
        latitude: 42.5273334,
        longitude: -71.13758250000001,
        storeHours: {
            markup: 'Mon - Sat: 10am - 9pm'
        }
    };
};

describe('store', function () {
    it('should receive an null store', function () {
        var result = new StoreModel(null);
        assert.deepEqual(result, {});
    });

    it('should convert API Store to an object', function () {
        var result = new StoreModel(createStoreObject());
        assert.equal(result.ID, 'Any ID');
        assert.equal(result.name, 'Downtown TV Shop');
        assert.equal(result.address1, '333 Washington St');
        assert.equal(result.address2, '');
        assert.equal(result.city, 'Boston');
        assert.equal(result.postalCode, '02108');
        assert.equal(result.phone, '333-333-3333');
        assert.equal(result.stateCode, 'MA');
        assert.equal(result.countryCode, 'us');
        assert.equal(result.latitude, 42.5273334);
        assert.equal(result.longitude, -71.13758250000001);
        assert.equal(result.storeHours, 'Mon - Sat: 10am - 9pm');
    });
});
