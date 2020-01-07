'use strict';

var assert = require('chai').assert;

describe('ShippingMethod', function () {
    var ShippingMethodModel = require('../../../../mocks/models/shippingMethod');

    it('should receive object with empty properties ', function () {
        var result = new ShippingMethodModel(null, null);
        assert.isNull(result.ID);
        assert.isNull(result.displayName);
        assert.isNull(result.description);
    });

    it('should set cost with no shipment parameter ', function () {
        var result = new ShippingMethodModel({
            ID: 'an ID',
            displayName: 'a diplayName',
            description: 'a description',
            custom: {
                estimatedArrivalTime: 'whenever'
            }
        }, null);
        assert.equal(result.ID, 'an ID');
        assert.equal(result.displayName, 'a diplayName');
        assert.equal(result.description, 'a description');
        assert.equal(result.estimatedArrivalTime, 'whenever');
    });

    it('should set cost with no custom attributes ', function () {
        var result = new ShippingMethodModel({
            ID: 'an ID',
            displayName: 'a diplayName',
            description: 'a description'
        }, null);
        assert.isNull(result.estimatedArrivalTime);
    });

    it('should set cost with defaultMethod ', function () {
        var result = new ShippingMethodModel({
            ID: 'an ID',
            displayName: 'a diplayName',
            description: 'a description',
            defaultMethod: true
        }, null);
        assert.isTrue(result.default);
    });

    it('should set cost with shipment parameter ', function () {
        var result = new ShippingMethodModel({
            ID: 'an ID',
            displayName: 'a diplayName',
            description: 'a description'
        }, {});

        assert.isDefined(result.shippingCost);
        assert.isDefined(result.selected);
    });

    it('should set isSelected shipment parameter with selected method', function () {
        var result = new ShippingMethodModel({
            ID: 'an ID',
            displayName: 'a diplayName',
            description: 'a description'
        }, {
            shippingMethod: {
                ID: 'an ID'
            }
        });

        assert.isTrue(result.selected);
    });
});
