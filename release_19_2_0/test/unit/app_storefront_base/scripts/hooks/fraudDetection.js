'use strict';

var assert = require('chai').assert;

describe('fraud detection hook', function () {
    var fraudDetection = require('../../../../../cartridges/app_storefront_base/cartridge/scripts/hooks/fraudDetection');

    it('should return a success object', function () {
        var fraudDetectionStatus = fraudDetection.fraudDetection();

        assert.equal(fraudDetectionStatus.status, 'success');
    });
});
