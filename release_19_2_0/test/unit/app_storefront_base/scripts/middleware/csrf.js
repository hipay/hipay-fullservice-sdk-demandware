'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var csrfProtection = {
    validateRequest: function () { return false; },
    getTokenName: function () { return 'name'; },
    generateToken: function () { return 'token'; }
};
var logoutCustomer = { logoutCustomer: function () { return {}; } };

var logoutStub = sinon.stub(logoutCustomer, 'logoutCustomer', function () { return {}; });

var validateRequestStub = sinon.stub(csrfProtection, 'validateRequest');
var getTokenNameStub = sinon.stub(csrfProtection, 'getTokenName');
var generateTokenStub = sinon.stub(csrfProtection, 'generateToken');


var csrfMiddleware = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/middleware/csrf', {
    'dw/web/CSRFProtection': {
        validateRequest: validateRequestStub,
        getTokenName: getTokenNameStub,
        generateToken: generateTokenStub
    },
    'dw/customer/CustomerMgr': {
        logoutCustomer: logoutStub
    },
    'dw/web/URLUtils': {
        url: function () {
            return 'some url';
        }
    }
});

describe('middleware', function () {
    var next = null;
    var res = {
        redirect: function () {
            return 'I got redirected';
        },
        setStatusCode: function () {
            return 'status code set';
        },
        setViewData: function () {
            return 'data set';
        }
    };

    beforeEach(function () {
        next = sinon.spy();
    });

    afterEach(function () {
        next.reset();
        validateRequestStub.reset();
        logoutStub.reset();
    });

    it('Should validate a request', function () {
        validateRequestStub.onCall(0).returns(true);

        csrfMiddleware.validateRequest(null, res, next);
        assert.isTrue(validateRequestStub.calledOnce);
        assert.isTrue(logoutStub.notCalled);
        assert.isTrue(next.calledOnce);
    });

    it('Should invalidate a request', function () {
        validateRequestStub.onCall(0).returns(false);

        csrfMiddleware.validateRequest(null, res, next);
        assert.isTrue(validateRequestStub.calledOnce);
        assert.isTrue(logoutStub.calledOnce);
        assert.isTrue(next.calledOnce);
    });

    it('Should validate an Ajax request', function () {
        validateRequestStub.onCall(0).returns(true);

        csrfMiddleware.validateAjaxRequest(null, res, next);
        assert.isTrue(validateRequestStub.calledOnce);
        assert.isTrue(logoutStub.notCalled);
        assert.isTrue(next.calledOnce);
    });

    it('Should invalidate an Ajax request', function () {
        validateRequestStub.onCall(0).returns(false);

        csrfMiddleware.validateAjaxRequest(null, res, next);
        assert.isTrue(validateRequestStub.calledOnce);
        assert.isTrue(logoutStub.calledOnce);
        assert.isTrue(next.calledOnce);
    });

    it('Should generateToken a token', function () {
        csrfMiddleware.generateToken(null, res, next);
        assert.isTrue(getTokenNameStub.calledOnce);
        assert.isTrue(generateTokenStub.calledOnce);
        assert.isTrue(next.calledOnce);
    });
});
