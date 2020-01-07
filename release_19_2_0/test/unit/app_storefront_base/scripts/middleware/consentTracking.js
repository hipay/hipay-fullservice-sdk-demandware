'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');

var gdprMiddleware = require('../../../../../cartridges/app_storefront_base/cartridge/scripts/middleware/consentTracking');

describe('gdpr consent', function () {
    var next = sinon.spy();
    var req = {
        session: {
            privacyCache: {
                map: new Map(), // eslint-disable-line no-undef
                get: function (key) { // eslint-disable-line no-unused-vars
                    return this.map.get(key);
                },
                set: function (key, value) { // eslint-disable-line no-unused-vars
                    this.map.set(key, value);
                },
                key: 'consent'
            },
            raw: {
                setTrackingAllowed: function () {}
            }
        }
    };
    var res = {
        redirect: sinon.spy(),
        setStatusCode: sinon.spy(),
        setViewData: sinon.spy()
    };

    afterEach(function () {
        next.reset();
        res.setViewData.reset();
    });

    it('Should set the consented flag to null if consent has not been given', function () {
        req.session.privacyCache.set('consent', null);
        var consented = req.session.privacyCache.get('consent');
        gdprMiddleware.consent(req, res, next);
        assert.equal(consented, null);
        assert.isTrue(res.setViewData.calledOnce);
        assert.isTrue(next.calledOnce);
    });

    it('Should set the consented flag to false if the consented is false', function () {
        req.session.privacyCache.set('consent', false);
        var consented = req.session.privacyCache.get('consent');
        gdprMiddleware.consent(req, res, next);
        assert.equal(consented, false);
        assert.isTrue(res.setViewData.calledOnce);
        assert.isTrue(next.calledOnce);
    });

    it('Should set the consented flag to true if the consented is true', function () {
        req.session.privacyCache.set('consent', true);
        var consented = req.session.privacyCache.get('consent');
        gdprMiddleware.consent(req, res, next);
        assert.equal(consented, true);
        assert.isTrue(res.setViewData.calledOnce);
        assert.isTrue(next.calledOnce);
    });
});
