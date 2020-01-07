'use strict';

var assert = require('chai').assert;
var AddressModel = require('../../../mocks/models/address');

var createOrderAddress = function () {
    return {
        address1: '1 Drury Lane',
        address2: null,
        countryCode: {
            displayValue: 'United States',
            value: 'US'
        },
        firstName: 'The Muffin',
        lastName: 'Man',
        city: 'Far Far Away',
        phone: '333-333-3333',
        postalCode: '04330',
        stateCode: 'ME'
    };
};

describe('address', function () {
    it('should receive an null address', function () {
        var result = new AddressModel(null);
        assert.equal(result.address, null);
    });

    it('should convert API Order Address to an object', function () {
        var result = new AddressModel(createOrderAddress());
        assert.equal(result.address.address1, '1 Drury Lane');
        assert.equal(result.address.address2, null);
        assert.equal(result.address.firstName, 'The Muffin');
        assert.equal(result.address.lastName, 'Man');
        assert.equal(result.address.city, 'Far Far Away');
        assert.equal(result.address.phone, '333-333-3333');
        assert.equal(result.address.postalCode, '04330');
        assert.equal(result.address.stateCode, 'ME');
        assert.deepEqual(result.address.countryCode, { displayValue: 'United States', value: 'US' });
    });
});
