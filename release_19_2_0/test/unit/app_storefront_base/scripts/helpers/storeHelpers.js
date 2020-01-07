'use strict';

var assert = require('chai').assert;
var storeHelpers = require('../../../../mocks/helpers/storeHelpers');

describe('storeHelpers', function () {
    describe('getStores', function () {
        var radiusOptions = [15, 30, 50, 100, 300];

        it('should return store model when search include postal code as search parameter. NO latitude, longitude, or geolocation latitude or longitude', function () {
            var url = '/on/demandware.store/Sites-RefArch-Site/en_US/Stores-FindStores';
            var radius = 15;
            var postalCode = '01803';
            var geolocation = {
                countryCode: 'US'
            };
            var latitude = null;
            var longitude = null;
            var showMap = false;

            var expectedStoreModel = {
                stores: [
                    {
                        ID: 'Any ID',
                        name: 'Downtown TV Shop',
                        address1: '333 Washington St',
                        address2: '',
                        city: 'Boston',
                        latitude: 42.5273334,
                        longitude: -71.13758250000001,
                        postalCode: '01803',
                        phone: '333-333-3333',
                        stateCode: 'MA',
                        countryCode: 'us',
                        storeHours: 'Mon - Sat: 10am - 9pm'
                    }
                ],
                locations: '[{"name":"Downtown TV Shop","latitude":42.5273334,"longitude":-71.13758250000001,"infoWindowHtml":"someString"}]',
                searchKey: {
                    'postalCode': postalCode
                },
                radius: radius,
                actionUrl: url,
                googleMapsApi: 'https://maps.googleapis.com/maps/api/js?key=SOME_API_KEY',
                radiusOptions: radiusOptions,
                storesResultsHtml: 'someString'
            };

            var storeObject = storeHelpers.getStores(radius, postalCode, latitude, longitude, geolocation, showMap, url);
            assert.deepEqual(storeObject, expectedStoreModel);
        });

        it('should return store model when search include longitute and latitute as search parameters. NO postal code or geolocation latitude or longitude.', function () {
            var url = '/on/demandware.store/Sites-RefArch-Site/en_US/Stores-FindStores';
            var radius = 15;
            var postalCode = '';
            var geolocation = {
                countryCode: 'US'
            };
            var latitude = 42.5273334;
            var longitude = -71.13758250000001;
            var showMap = false;

            var expectedStoreModel = {
                stores: [
                    {
                        ID: 'Any ID',
                        name: 'Downtown TV Shop',
                        address1: '333 Washington St',
                        address2: '',
                        city: 'Boston',
                        latitude: 42.5273334,
                        longitude: -71.13758250000001,
                        postalCode: '01803',
                        phone: '333-333-3333',
                        stateCode: 'MA',
                        countryCode: 'us',
                        storeHours: 'Mon - Sat: 10am - 9pm'
                    }
                ],
                locations: '[{"name":"Downtown TV Shop","latitude":42.5273334,"longitude":-71.13758250000001,"infoWindowHtml":"someString"}]',
                searchKey: {
                    'lat': 42.5273334,
                    'long': -71.13758250000001
                },
                radius: radius,
                actionUrl: url,
                googleMapsApi: 'https://maps.googleapis.com/maps/api/js?key=SOME_API_KEY',
                radiusOptions: radiusOptions,
                storesResultsHtml: 'someString'
            };

            var storeObject = storeHelpers.getStores(radius, postalCode, latitude, longitude, geolocation, showMap, url);
            assert.deepEqual(storeObject, expectedStoreModel);
        });

        it('should return store model when use geolocation latitude or longitude. NO postal code, latitute, longitute, radius as search parameters. no URL and non-US ', function () {
            var url = null;
            var radius = null;
            var postalCode = null;
            var geolocation = {
                countryCode: 'UK',
                latitude: 42.5273334,
                longitude: -71.13758250000001
            };
            var latitude = null;
            var longitude = null;
            var showMap = true;

            var expectedStoreModel = {
                stores: [
                    {
                        ID: 'Any ID',
                        name: 'Downtown TV Shop',
                        address1: '333 Washington St',
                        address2: '',
                        city: 'Boston',
                        latitude: 42.5273334,
                        longitude: -71.13758250000001,
                        postalCode: '01803',
                        phone: '333-333-3333',
                        stateCode: 'MA',
                        countryCode: 'us',
                        storeHours: 'Mon - Sat: 10am - 9pm'
                    }
                ],
                locations: '[{"name":"Downtown TV Shop","latitude":42.5273334,"longitude":-71.13758250000001,"infoWindowHtml":"someString"}]',
                searchKey: {
                    'lat': 42.5273334,
                    'long': -71.13758250000001
                },
                radius: 15,
                actionUrl: 'path-to-endpoint/Stores-FindStores',
                googleMapsApi: 'https://maps.googleapis.com/maps/api/js?key=SOME_API_KEY',
                radiusOptions: radiusOptions,
                storesResultsHtml: 'someString'
            };

            var storeObject = storeHelpers.getStores(radius, postalCode, latitude, longitude, geolocation, showMap, url);
            assert.deepEqual(storeObject, expectedStoreModel);
        });
    });

    describe('createStoresResultsHtml', function () {
        it('should return the rendered HTML', function () {
            var stores = [
                {
                    ID: 'storeId00001',
                    name: 'Downtown TV Shop'
                },
                {
                    ID: 'storeId00002',
                    name: 'Uptown TV Shop'
                },
                {
                    ID: 'storeId00001',
                    name: 'Midtown TV Shop'
                }
            ];

            var renderedHtml = storeHelpers.createStoresResultsHtml(stores);
            assert.equal(renderedHtml, 'rendered html');
        });
    });
});
