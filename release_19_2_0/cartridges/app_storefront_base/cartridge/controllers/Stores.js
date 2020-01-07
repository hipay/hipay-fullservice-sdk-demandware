'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var storeHelpers = require('*/cartridge/scripts/helpers/storeHelpers');
server.get('Find', server.middleware.https, cache.applyDefaultCache, consentTracking.consent, function (req, res, next) {
    var radius = req.querystring.radius;
    var postalCode = req.querystring.postalCode;
    var lat = req.querystring.lat;
    var long = req.querystring.long;
    var showMap = req.querystring.showMap || false;
    var horizontalView = req.querystring.horizontalView || false;
    var isForm = req.querystring.isForm || false;

    var stores = storeHelpers.getStores(radius, postalCode, lat, long, req.geolocation, showMap);
    var viewData = {
        stores: stores,
        horizontalView: horizontalView,
        isForm: isForm,
        showMap: showMap
    };

    res.render('storeLocator/storeLocator', viewData);
    next();
});

// The req parameter in the unnamed callback function is a local instance of the request object.
// The req parameter has a property called querystring. In this use case the querystring could
// have the following:
// lat - The latitude of the users position.
// long - The longitude of the users position.
// radius - The radius that the user selected to refine the search
// or
// postalCode - The postal code that the user used to search.
// radius - The radius that the user selected to refine the search
server.get('FindStores', function (req, res, next) {
    var radius = req.querystring.radius;
    var postalCode = req.querystring.postalCode;
    var lat = req.querystring.lat;
    var long = req.querystring.long;
    var showMap = req.querystring.showMap || false;

    var stores = storeHelpers.getStores(radius, postalCode, lat, long, req.geolocation, showMap);

    res.json(stores);
    next();
});

module.exports = server.exports();
