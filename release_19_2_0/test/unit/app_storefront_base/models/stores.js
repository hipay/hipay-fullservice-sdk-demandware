'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('stores', function () {
    var StoreModel = require('../../../mocks/models/store');
    var StoresModel = proxyquire('../../../../cartridges/app_storefront_base/cartridge/models/stores', {
        '*/cartridge/models/store': StoreModel,
        'dw/util/HashMap': function () {
            return {
                result: {},
                put: function (key, context) {
                    this.result[key] = context;
                }
            };
        },
        'dw/value/Money': function () {},
        'dw/util/Template': function () {
            return {
                render: function () {
                    return { text: 'someString' };
                }
            };
        },
        '*/cartridge/scripts/renderTemplateHelper': {
            getRenderedHtml: function () { return 'someString'; }
        },

        '*/cartridge/scripts/helpers/storeHelpers': {
            createStoresResultsHtml: function () {
                return 'someString';
            }
        }
    });
    var actionUrl = '/on/demandware.store/Sites-MobileFirst-Site/en_US/Stores-FindStores';
    var apiKey = 'YOUR_API_KEY';
    var searchKey = { lat: 42.4019, long: -71.1193 };
    var radius = 100;
    var radiusOptions = [15, 30, 50, 100, 300];

    it('should return Stores Model with stores found', function () {
        var storesResults = [{
            ID: 'Any ID',
            name: 'Downtown TV Shop',
            address1: '333 Washington St',
            address2: '',
            city: 'Boston',
            postalCode: '02108',
            phone: '333-333-3333',
            stateCode: 'MA',
            countryCode: {
                value: 'us'
            },
            latitude: 42.5273334,
            longitude: -71.13758250000001,
            storeHours: {
                markup: 'Mon - Sat: 10am - 9pm'
            }
        }];
        var stores = new StoresModel(storesResults, searchKey, radius, actionUrl, apiKey);

        assert.deepEqual(stores, {
            stores: [
                {
                    ID: 'Any ID',
                    name: 'Downtown TV Shop',
                    address1: '333 Washington St',
                    address2: '',
                    city: 'Boston',
                    latitude: 42.5273334,
                    longitude: -71.13758250000001,
                    postalCode: '02108',
                    phone: '333-333-3333',
                    stateCode: 'MA',
                    countryCode: 'us',
                    storeHours: 'Mon - Sat: 10am - 9pm'
                }
            ],
            locations: '[{"name":"Downtown TV Shop","latitude":42.5273334,"longitude":-71.13758250000001,"infoWindowHtml":"someString"}]',
            searchKey: searchKey,
            radius: radius,
            actionUrl: actionUrl,
            googleMapsApi: 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY',
            radiusOptions: radiusOptions,
            storesResultsHtml: 'someString'
        });
    });

    it('should return Stores Model with stores that do not have a phone or state', function () {
        var storesResults = [{
            ID: 'Any ID',
            name: 'Downtown TV Shop',
            address1: '333 Washington St',
            address2: '',
            city: 'Boston',
            postalCode: '02108',
            countryCode: {
                value: 'us'
            },
            latitude: 42.5273334,
            longitude: -71.13758250000001
        }];
        var stores = new StoresModel(storesResults, searchKey, radius, actionUrl, apiKey);

        assert.deepEqual(stores, {
            stores: [
                {
                    ID: 'Any ID',
                    name: 'Downtown TV Shop',
                    address1: '333 Washington St',
                    address2: '',
                    city: 'Boston',
                    latitude: 42.5273334,
                    longitude: -71.13758250000001,
                    postalCode: '02108',
                    countryCode: 'us'
                }
            ],
            locations: '[{"name":"Downtown TV Shop","latitude":42.5273334,"longitude":-71.13758250000001,"infoWindowHtml":"someString"}]',
            searchKey: searchKey,
            radius: radius,
            actionUrl: actionUrl,
            googleMapsApi: 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY',
            radiusOptions: radiusOptions,
            storesResultsHtml: 'someString'
        });
    });

    it('should return Stores Model with no stores found', function () {
        var stores = new StoresModel([], searchKey, radius, actionUrl, apiKey);

        assert.deepEqual(stores, {
            stores: [],
            locations: '[]',
            searchKey: searchKey,
            radius: 100,
            actionUrl: actionUrl,
            googleMapsApi: 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY',
            radiusOptions: radiusOptions,
            storesResultsHtml: 'someString'
        });
    });

    it('should return Stores Model without google maps api', function () {
        var storesResults = [{
            ID: 'Any ID',
            name: 'Downtown TV Shop',
            address1: '333 Washington St',
            address2: '',
            city: 'Boston',
            postalCode: '02108',
            phone: '333-333-3333',
            stateCode: 'MA',
            countryCode: {
                value: 'us'
            },
            latitude: 42.5273334,
            longitude: -71.13758250000001
        }];
        var noApiKey = null;
        var stores = new StoresModel(storesResults, searchKey, radius, actionUrl, noApiKey);

        assert.deepEqual(stores, {
            stores: [
                {
                    ID: 'Any ID',
                    name: 'Downtown TV Shop',
                    address1: '333 Washington St',
                    address2: '',
                    city: 'Boston',
                    latitude: 42.5273334,
                    longitude: -71.13758250000001,
                    postalCode: '02108',
                    countryCode: 'us',
                    phone: '333-333-3333',
                    stateCode: 'MA'
                }
            ],
            locations: '[{"name":"Downtown TV Shop","latitude":42.5273334,"longitude":-71.13758250000001,"infoWindowHtml":"someString"}]',
            searchKey: searchKey,
            radius: radius,
            actionUrl: actionUrl,
            googleMapsApi: null,
            radiusOptions: radiusOptions,
            storesResultsHtml: 'someString'
        });
    });
});
