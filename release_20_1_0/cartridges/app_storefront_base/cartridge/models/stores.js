'use strict';

var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
var storeHelpers = require('*/cartridge/scripts/helpers/storeHelpers');
var StoreModel = require('*/cartridge/models/store');

/**
 * Creates an array of objects containing store information
 * @param {dw.util.Set} storesObject - a set of <dw.catalog.Store> objects
 * @returns {Array} an array of objects that contains store information
 */
function createStoresObject(storesObject) {
    return Object.keys(storesObject).map(function (key) {
        var store = storesObject[key];
        var storeModel = new StoreModel(store);
        return storeModel;
    });
}

/**
 * Creates an array of objects containing the coordinates of the store's returned by the search
 * @param {dw.util.Set} storesObject - a set of <dw.catalog.Store> objects
 * @returns {Array} an array of coordinates objects with store info
 */
function createGeoLocationObject(storesObject) {
    var context;
    var template = 'storeLocator/storeInfoWindow';
    return Object.keys(storesObject).map(function (key) {
        var store = storesObject[key];
        var storeModel = new StoreModel(store);
        context = { store: storeModel };
        return {
            name: store.name,
            latitude: store.latitude,
            longitude: store.longitude,
            infoWindowHtml: renderTemplateHelper.getRenderedHtml(context, template)
        };
    });
}

/**
 * If there is an api key creates the url to include the google maps api else returns null
 * @param {string} apiKey - the api key or null
 * @returns {string|Null} return the api
 */
function getGoogleMapsApi(apiKey) {
    var googleMapsApi;
    if (apiKey) {
        googleMapsApi = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey;
    } else {
        googleMapsApi = null;
    }

    return googleMapsApi;
}

/**
 * @constructor
 * @classdesc The stores model
 * @param {dw.util.Set} storesResultsObject - a set of <dw.catalog.Store> objects
 * @param {Object} searchKey - what the user searched by (location or postal code)
 * @param {number} searchRadius - the radius used in the search
 * @param {dw.web.URL} actionUrl - a relative url
 * @param {string} apiKey - the google maps api key that is set in site preferences
 */
function stores(storesResultsObject, searchKey, searchRadius, actionUrl, apiKey) {
    this.stores = createStoresObject(storesResultsObject);
    this.locations = JSON.stringify(createGeoLocationObject(storesResultsObject));
    this.searchKey = searchKey;
    this.radius = searchRadius;
    this.actionUrl = actionUrl;
    this.googleMapsApi = getGoogleMapsApi(apiKey);
    this.radiusOptions = [15, 30, 50, 100, 300];
    this.storesResultsHtml = this.stores ? storeHelpers.createStoresResultsHtml(this.stores) : null;
}

module.exports = stores;
