'use strict';

var Response = require('../../../../cartridges/modules/server/response');
var assert = require('chai').assert;

describe('response', function () {
    it('should create response object with passed-in base', function () {
        var base = { redirect: function () {} };
        var response = new Response(base);
        assert.property(response, 'base');
        assert.property(response.base, 'redirect');
    });

    it('should correctly set view and viewData', function () {
        var response = new Response({});
        response.render('test', { name: 'value' });
        assert.equal(response.view, 'test');
        assert.equal(response.viewData.name, 'value');
    });

    it('should extend viewData', function () {
        var response = new Response({});
        response.setViewData({ name: 'value' });
        response.setViewData({ foo: 'bar' });
        response.render('test', { name: 'test' });
        assert.equal(response.viewData.name, 'test');
        assert.equal(response.viewData.foo, 'bar');
    });

    it('should not extend viewData with non-objects', function () {
        var response = new Response({});
        response.setViewData({ name: 'value' });
        response.setViewData(function () {});
        assert.equal(response.viewData.name, 'value');
    });

    it('should correctly set json', function () {
        var response = new Response({});
        response.json({ name: 'value' });
        assert.isTrue(response.isJson);
        assert.equal(response.viewData.name, 'value');
    });

    it('should correctly set xml', function () {
        var response = new Response({});
        response.xml('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
        assert.isTrue(response.isXml);
        assert.equal(response.viewData.xml, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    });

    it('should correctly set url', function () {
        var response = new Response({});
        response.redirect('hello');
        assert.equal(response.redirectUrl, 'hello');
    });

    it('should correctly set redirect status', function () {
        var response = new Response({});
        response.setRedirectStatus('301');
        assert.equal(response.redirectStatus, '301');
    });

    it('should set and retrieve data', function () {
        var response = new Response({});
        response.setViewData({ name: 'value' });
        assert.equal(response.getViewData().name, 'value');
    });

    it('should log item', function () {
        var response = new Response({});
        response.log('one', 'two', 'three');
        assert.equal(response.messageLog.length, 1);
        assert.equal(response.messageLog[0], 'one two three');
    });

    it('should convert log item to json', function () {
        var response = new Response({});
        response.log({ name: 'value' });
        assert.equal(response.messageLog.length, 1);
        assert.equal(response.messageLog[0], '{"name":"value"}');
    });

    it('should try to print out a message', function () {
        var response = new Response();
        response.print('hello');

        assert.equal(response.renderings.length, 1);
        assert.equal(response.renderings[0].type, 'print');
        assert.equal(response.renderings[0].message, 'hello');
    });

    it('should set http header', function (done) {
        var response = new Response({
            setHttpHeader: function (name, value) {
                assert.equal(name, 'someName');
                assert.equal(value, 'someValue');

                done();
            }
        });

        response.setHttpHeader('someName', 'someValue');
    });

    it('should set content type', function (done) {
        var response = new Response({
            setContentType: function (type) { assert.equal(type, 'text/html'); done(); }
        });
        response.setContentType('text/html');
    });

    it('should set status code', function (done) {
        var response = new Response({
            setStatus: function (code) { assert.equal(code, 500); done(); }
        });
        response.setStatusCode(500);
    });

    it('should set cache expiration for the page', function (done) {
        var response = new Response();
        response.cacheExpiration(6);
        assert.equal(6, response.cachePeriod);
        done();
    });

    it('should loop through and append to renderings array', function () {
        var response = new Response();
        response.renderings.push({ type: 'render', subType: 'isml' });

        response.json({ name: 'value' });

        assert.isTrue(response.isJson);
        assert.equal(response.viewData.name, 'value');

        assert.equal(response.renderings.length, 1);
        assert.equal(response.renderings[0].type, 'render');
        assert.equal(response.renderings[0].subType, 'json');
    });

    it('should loop through and append to renderings array', function () {
        var response = new Response();
        response.renderings.push({ type: 'print' });

        response.json({ name: 'value' });

        assert.equal(response.renderings.length, 2);
        assert.equal(response.renderings[0].type, 'print');

        assert.equal(response.renderings[1].type, 'render');
        assert.equal(response.renderings[1].subType, 'json');
    });
});
