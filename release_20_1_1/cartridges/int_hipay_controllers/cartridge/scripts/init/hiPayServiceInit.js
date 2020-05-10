/**
 * Initialize REST service registry for a HiPay API
 */

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Encoding = require('dw/crypto/Encoding');
var Bytes = require('dw/util/Bytes');
var Site = require('dw/system/Site');

// HiPay Generate Token Service
function createToken() {
    var siteId = Site.getCurrent().getID();
    var service = LocalServiceRegistry.createService('hipay.rest.createtoken.' + siteId, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');

            // Set headers
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Cache-Control', 'no-cache');
            svc.addHeader('Accept', 'application/json');

            var serviceConfig = svc.getConfiguration();

            // Get HiPay credentials
            var credentials = serviceConfig.getCredential();
            var credString = credentials.getUser() + ':' + credentials.getPassword();
            var base64Credentials = Encoding.toBase64(new Bytes(credString));
            svc.addHeader('Authentication', 'Basic ' + base64Credentials);

            return JSON.stringify(args);
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return service;
}

// HiPay Order Service
function order() {
    var siteId = Site.getCurrent().getID();
    var service = LocalServiceRegistry.createService('hipay.rest.order.' + siteId, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');

            // Set headers
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Cache-Control', 'no-cache');
            svc.addHeader('Accept', 'application/json');

            var serviceConfig = svc.getConfiguration();

            // Get HiPay credentials
            var credentials = serviceConfig.getCredential();
            var credString = credentials.getUser() + ':' + credentials.getPassword();
            var base64Credentials = Encoding.toBase64(new Bytes(credString));

            svc.addHeader('Authentication', 'Basic ' + base64Credentials);

            return JSON.stringify(args);
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return service;
}

// HiPay Hosted Payment Service
function hpayment() {
    var siteId = Site.getCurrent().getID();
    var service = LocalServiceRegistry.createService('hipay.rest.hpayment.' + siteId, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');

            // Set headers
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Cache-Control', 'no-cache');
            svc.addHeader('Accept', 'application/json');

            var serviceConfig = svc.getConfiguration();

            // Get HiPay credentials
            var credentials = serviceConfig.getCredential();
            var credString = credentials.getUser() + ':' + credentials.getPassword();
            var base64Credentials = Encoding.toBase64(new Bytes(credString));
            svc.addHeader('Authentication', 'Basic ' + base64Credentials);

            return JSON.stringify(args);
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return service;
}

// HiPay Maintenance Service
function maintenance() {
    var siteId = Site.getCurrent().getID();
    var service = LocalServiceRegistry.createService('hipay.rest.maintenance.' + siteId, {
        createRequest: function (svc, args) {
           svc.setRequestMethod('POST');

           // Set headers
           svc.addHeader('Content-Type', 'application/json');
           svc.addHeader('Cache-Control', 'no-cache');
           svc.addHeader('Accept', 'application/json');

           var serviceConfig = svc.getConfiguration();

           // Get HiPay credentials
           var credentials = serviceConfig.getCredential();
           var credString = credentials.getUser() + ':' + credentials.getPassword();
           var base64Credentials = Encoding.toBase64(new Bytes(credString));
           svc.addHeader('Authentication', 'Basic ' + base64Credentials);

           return JSON.stringify(args);
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return service;
}

module.exports = {
    createToken: createToken,
    order: order,
    hpayment: hpayment,
    maintenance: maintenance
};
