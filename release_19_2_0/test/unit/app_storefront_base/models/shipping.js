'use strict';

var assert = require('chai').assert;

var otherAddress = {
    'city': 'Boston',
    'postalCode': '12345'
};

var defaultShipment = {
    UUID: '1234-1234-1234-1234',
    setShippingMethod: function (shippingMethod) {
        return shippingMethod;
    },
    shippingMethod: {
        ID: '001',
        displayName: 'Ground',
        description: 'Order received within 7-10 business days',
        custom: {
            estimatedArrivalTime: '7-10 Business Days'
        }
    }
};

var defaultShipmentWithAddress = {
    UUID: '1234-1234-1234-1235',
    setShippingMethod: function (shippingMethod) {
        return shippingMethod;
    },
    shippingAddress: {
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
    },
    shippingMethod: {
        ID: '001',
        displayName: 'Ground',
        description: 'Order received within 7-10 business days',
        custom: {
            estimatedArrivalTime: '7-10 Business Days'
        }
    },
    gift: true
};

describe('Shipping', function () {
    var ShippingModel = require('../../../mocks/models/shipping');

    it('should receive object with null properties ', function () {
        var result = new ShippingModel(null, null);
        assert.deepEqual(result, {
            UUID: null,
            productLineItems: null,
            applicableShippingMethods: null,
            matchingAddressId: false,
            shippingAddress: null,
            selectedShippingMethod: null,
            isGift: null,
            giftMessage: null
        });
    });

    it('should get the selected shipping method information', function () {
        var result = new ShippingModel(defaultShipment, null);

        assert.equal(result.selectedShippingMethod.ID, '001');
        assert.equal(result.selectedShippingMethod.displayName, 'Ground');
        assert.equal(
            result.selectedShippingMethod.description,
            'Order received within 7-10 business days'
        );
    });

    it('should get shipping methods and convert to a plain object', function () {
        var result = new ShippingModel(defaultShipment, null);
        assert.equal(
            result.applicableShippingMethods[0].description,
            'Order received within 7-10 business days'
        );
        assert.equal(result.applicableShippingMethods[0].displayName, 'Ground');
        assert.equal(result.applicableShippingMethods[0].ID, '001');
        assert.equal(result.applicableShippingMethods[0].estimatedArrivalTime, '7-10 Business Days');
    });

    it('should get shipping address from shipment', function () {
        var result = new ShippingModel(defaultShipmentWithAddress, null);
        assert.equal(result.shippingAddress.firstName, 'The Muffin');
    });

    it('should get shipping address from another address', function () {
        var result = new ShippingModel(defaultShipment, otherAddress);
        assert.equal(result.shippingAddress.postalCode, '12345');
    });

    it('should prefer shipping address from shipment', function () {
        var result = new ShippingModel(defaultShipmentWithAddress, otherAddress);
        assert.equal(result.shippingAddress.postalCode, '04330');
    });

    it('should return shipment without an address', function () {
        var shipment = Object.assign({}, defaultShipmentWithAddress);
        shipment.shippingAddress = Object.assign({}, defaultShipmentWithAddress.shippingAddress);

        shipment.shippingAddress = {
            address1: null,
            address2: null,
            countryCode: null,
            firstName: null,
            lastName: null,
            city: null,
            phone: null,
            postalCode: null,
            stateCode: null
        };
        var result = new ShippingModel(shipment);
        assert.isUndefined(result.shippingAddress);
    });

    // it('should set default shipping method when shippingMethodID is supplied', function () {
    //     var shippingMethodID = '002';
    //     var shippingMethod = {
    //         description: 'Order received in 2 business days',
    //         displayName: '2-Day Express',
    //         ID: '002',
    //         shippingCost: '$0.00',
    //         custom: {
    //             estimatedArrivalTime: '2 Business Days'
    //         }
    //     };
    //     var spy = sinon.spy(defaultShipment, 'setShippingMethod');
    //     spy.withArgs(shippingMethod);

    //     ShippingModel.selectShippingMethod(defaultShipment, shippingMethodID);

    //     assert.isTrue(spy.calledOnce);
    //     assert.isTrue(spy.withArgs(shippingMethod).calledOnce);
    //     defaultShipment.setShippingMethod.restore();
    // });

    // it('should set default shipping method when shippingMethodID is not supplied', function () {
    //     var shippingMethodID = null;
    //     var spy = sinon.spy(defaultShipment, 'setShippingMethod');
    //     spy.withArgs(null);

    //     ShippingModel.selectShippingMethod(defaultShipment, shippingMethodID);

    //     assert.isTrue(spy.calledOnce);
    //     assert.isTrue(spy.withArgs(null).calledOnce);
    //     defaultShipment.setShippingMethod.restore();
    // });

    // it('should set default shipping method when shippingMethods are supplied', function () {
    //     var shippingMethodID = '001';
    //     var shippingMethods = new ArrayList([
    //         {
    //             description: 'Order received within 7-10 business days',
    //             displayName: 'Ground',
    //             ID: '001',
    //             custom: {
    //                 estimatedArrivalTime: '7-10 Business Days'
    //             }
    //         }
    //     ]);
    //     var shippingMethod = {
    //         description: 'Order received within 7-10 business days',
    //         displayName: 'Ground',
    //         ID: '001',
    //         custom: {
    //             estimatedArrivalTime: '7-10 Business Days'
    //         }
    //     };
    //     var spy = sinon.spy(defaultShipment, 'setShippingMethod');
    //     spy.withArgs(shippingMethod);

    //     ShippingModel.selectShippingMethod(defaultShipment, shippingMethodID, shippingMethods);

    //     assert.isTrue(spy.calledOnce);
    //     assert.isTrue(spy.withArgs(shippingMethod).calledOnce);
    //     defaultShipment.setShippingMethod.restore();
    // });
});
