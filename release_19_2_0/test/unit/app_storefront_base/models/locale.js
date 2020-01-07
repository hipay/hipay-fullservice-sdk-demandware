'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var allowedLocales;

describe('locale', function () {
    var LocaleModel = proxyquire('../../../../cartridges/app_storefront_base/cartridge/models/locale', {
        '*/cartridge/config/countries': [{
            'id': 'en_US',
            'currencyCode': 'USD'
        }, {
            'id': 'en_GB',
            'currencyCode': 'GBP'
        }, {
            'id': 'ja_JP',
            'currencyCode': 'JPY'
        }, {
            'id': 'zh_CN',
            'currencyCode': 'CNY'
        }, {
            'id': 'fr_FR',
            'currencyCode': 'EUR'
        }, {
            'id': 'it_IT',
            'currencyCode': 'EUR'
        }],
        'dw/util/Locale': {
            getLocale: function (localeID) {
                var returnValue;
                switch (localeID) {
                    case 'en_US':
                        returnValue = {
                            country: 'US',
                            displayCountry: 'United States',
                            currencyCode: 'USD',
                            displayName: 'English (US)',
                            language: 'en',
                            displayLanguage: 'English'
                        };
                        break;
                    case 'en_GB':
                        returnValue = {
                            country: 'GB',
                            displayCountry: 'United Kingdom',
                            currencyCode: 'GBP',
                            displayName: 'English (UK)',
                            language: 'en',
                            displayLanguage: 'English'
                        };
                        break;
                    case 'fr_FR':
                        returnValue = {
                            country: 'FR',
                            displayCountry: 'France',
                            currencyCode: 'EUR',
                            displayName: 'français',
                            language: 'fr',
                            displayLanguage: 'Français'
                        };
                        break;
                    case 'it_IT':
                        returnValue = {
                            country: 'IT',
                            displayCountry: 'Italia',
                            currencyCode: 'EUR',
                            displayName: 'italiano',
                            language: 'it',
                            displayLanguage: 'Italiano'

                        };
                        break;
                    case 'ja_JP':
                        returnValue = {
                            country: 'JP',
                            displayCountry: '日本',
                            currencyCode: 'JPY',
                            displayName: '日本の',
                            language: 'ja',
                            displayLanguage: '日本語'
                        };
                        break;
                    case 'zh_CN':
                        returnValue = {
                            country: 'CN',
                            displayCountry: '中国',
                            currencyCode: 'CNY',
                            displayName: '日本',
                            language: 'zh',
                            displayLanguage: '中国語'
                        };
                        break;
                    default:
                        returnValue = null;
                }
                return returnValue;
            },
            ID: 'LocaleID'
        }
    });

    before(function () {
        allowedLocales = ['en_GB', 'fr_FR', 'ja_JP', 'zh_CN', 'default', 'it_IT'];
    });
    it('should expected locales for en_GB', function () {
        var currentLocale = {
            ID: 'en_GB',
            displayCountry: 'United Kingdom',
            country: 'GB',
            displayName: 'English (UK)',
            language: 'en',
            displayLanguage: 'English'
        };
        var siteId = 'RefArch';
        var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);

        assert.deepEqual(localeModel, {
            'locale': {
                'countryCode': 'GB',
                'currencyCode': 'GBP',
                'localLinks': [
                    {
                        'country': 'JP',
                        'currencyCode': 'JPY',
                        'displayCountry': '日本',
                        'localID': 'ja_JP',
                        'displayName': '日本の',
                        'language': 'ja',
                        'displayLanguage': '日本語'
                    }, {
                        'country': 'CN',
                        'currencyCode': 'CNY',
                        'displayCountry': '中国',
                        'localID': 'zh_CN',
                        'displayName': '日本',
                        'language': 'zh',
                        'displayLanguage': '中国語'
                    }, {
                        'country': 'FR',
                        'currencyCode': 'EUR',
                        'displayCountry': 'France',
                        'localID': 'fr_FR',
                        'displayName': 'français',
                        'language': 'fr',
                        'displayLanguage': 'Français'
                    }, {
                        'country': 'IT',
                        'currencyCode': 'EUR',
                        'displayCountry': 'Italia',
                        'localID': 'it_IT',
                        'displayName': 'italiano',
                        'language': 'it',
                        'displayLanguage': 'Italiano'
                    }
                ],
                'name': 'United Kingdom',
                'displayName': 'English (UK)',
                'language': 'en',
                'displayLanguage': 'English'
            }
        });
    });
    it('should return proper fr_FR info', function () {
        var currentLocale = {
            ID: 'fr_FR',
            displayCountry: 'France',
            country: 'FR',
            displayName: 'français',
            language: 'fr',
            displayLanguage: 'Français'
        };
        var siteId = 'RefArch';
        var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);
        assert.deepEqual(localeModel, {
            'locale': {
                'countryCode': 'FR',
                'currencyCode': 'EUR',
                'localLinks': [
                    {
                        'country': 'GB',
                        'currencyCode': 'GBP',
                        'displayCountry': 'United Kingdom',
                        'localID': 'en_GB',
                        'displayName': 'English (UK)',
                        'language': 'en',
                        'displayLanguage': 'English'
                    }, {
                        'country': 'JP',
                        'currencyCode': 'JPY',
                        'displayCountry': '日本',
                        'localID': 'ja_JP',
                        'displayName': '日本の',
                        'language': 'ja',
                        'displayLanguage': '日本語'
                    }, {
                        'country': 'CN',
                        'currencyCode': 'CNY',
                        'displayCountry': '中国',
                        'localID': 'zh_CN',
                        'displayName': '日本',
                        'language': 'zh',
                        'displayLanguage': '中国語'
                    }, {
                        'country': 'IT',
                        'currencyCode': 'EUR',
                        'displayCountry': 'Italia',
                        'localID': 'it_IT',
                        'displayName': 'italiano',
                        'language': 'it',
                        'displayLanguage': 'Italiano'
                    }
                ],
                'name': 'France',
                'displayName': 'français',
                'language': 'fr',
                'displayLanguage': 'Français'
            }
        });
    });
    it('should return proper it_IT info', function () {
        var currentLocale = {
            ID: 'it_IT',
            displayCountry: 'Italia',
            country: 'IT',
            displayName: 'italiano',
            language: 'it',
            displayLanguage: 'Italiano'
        };
        var siteId = 'RefArch';
        var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);
        assert.deepEqual(localeModel, {
            'locale': {
                'countryCode': 'IT',
                'currencyCode': 'EUR',
                'localLinks': [
                    {
                        'country': 'GB',
                        'currencyCode': 'GBP',
                        'displayCountry': 'United Kingdom',
                        'localID': 'en_GB',
                        'displayName': 'English (UK)',
                        'language': 'en',
                        'displayLanguage': 'English'
                    }, {
                        'country': 'JP',
                        'currencyCode': 'JPY',
                        'displayCountry': '日本',
                        'localID': 'ja_JP',
                        'displayName': '日本の',
                        'language': 'ja',
                        'displayLanguage': '日本語'
                    }, {
                        'country': 'CN',
                        'currencyCode': 'CNY',
                        'displayCountry': '中国',
                        'localID': 'zh_CN',
                        'displayName': '日本',
                        'language': 'zh',
                        'displayLanguage': '中国語'
                    }, {
                        'country': 'FR',
                        'currencyCode': 'EUR',
                        'displayCountry': 'France',
                        'localID': 'fr_FR',
                        'displayName': 'français',
                        'language': 'fr',
                        'displayLanguage': 'Français'
                    }
                ],
                'name': 'Italia',
                'displayName': 'italiano',
                'language': 'it',
                'displayLanguage': 'Italiano'
            }
        });
    });
    it('should return proper JA info', function () {
        var currentLocale = {
            ID: 'ja_JP',
            displayCountry: '日本',
            country: 'JA',
            displayName: '日本の',
            language: 'ja',
            displayLanguage: '日本語'
        };
        var siteId = 'RefArch';
        var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);
        assert.deepEqual(localeModel, {
            'locale': {
                'countryCode': 'JA',
                'currencyCode': 'JPY',
                'localLinks': [
                    {
                        'country': 'GB',
                        'currencyCode': 'GBP',
                        'displayCountry': 'United Kingdom',
                        'localID': 'en_GB',
                        'displayName': 'English (UK)',
                        'language': 'en',
                        'displayLanguage': 'English'
                    }, {
                        'country': 'CN',
                        'currencyCode': 'CNY',
                        'displayCountry': '中国',
                        'localID': 'zh_CN',
                        'displayName': '日本',
                        'language': 'zh',
                        'displayLanguage': '中国語'
                    }, {
                        'country': 'FR',
                        'currencyCode': 'EUR',
                        'displayCountry': 'France',
                        'localID': 'fr_FR',
                        'displayName': 'français',
                        'language': 'fr',
                        'displayLanguage': 'Français'
                    }, {
                        'country': 'IT',
                        'currencyCode': 'EUR',
                        'displayCountry': 'Italia',
                        'localID': 'it_IT',
                        'displayName': 'italiano',
                        'language': 'it',
                        'displayLanguage': 'Italiano'
                    }
                ],
                'name': '日本',
                'displayName': '日本の',
                'language': 'ja',
                'displayLanguage': '日本語'
            }
        });
    });
    it('should return proper ZN info', function () {
        var currentLocale = {
            ID: 'zh_CN',
            displayCountry: '中国',
            country: 'CN',
            displayName: '日本',
            language: 'zh',
            displayLanguage: '中国語'
        };
        var siteId = 'RefArch';
        var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);
        assert.deepEqual(localeModel, {
            'locale': {
                'countryCode': 'CN',
                'currencyCode': 'CNY',
                'localLinks': [
                    {
                        'country': 'GB',
                        'currencyCode': 'GBP',
                        'displayCountry': 'United Kingdom',
                        'localID': 'en_GB',
                        'displayName': 'English (UK)',
                        'language': 'en',
                        'displayLanguage': 'English'
                    }, {
                        'country': 'JP',
                        'currencyCode': 'JPY',
                        'displayCountry': '日本',
                        'localID': 'ja_JP',
                        'displayName': '日本の',
                        'language': 'ja',
                        'displayLanguage': '日本語'
                    }, {
                        'country': 'FR',
                        'currencyCode': 'EUR',
                        'displayCountry': 'France',
                        'localID': 'fr_FR',
                        'displayName': 'français',
                        'language': 'fr',
                        'displayLanguage': 'Français'
                    }, {
                        'country': 'IT',
                        'currencyCode': 'EUR',
                        'displayCountry': 'Italia',
                        'localID': 'it_IT',
                        'displayName': 'italiano',
                        'language': 'it',
                        'displayLanguage': 'Italiano'
                    }
                ],
                'name': '中国',
                'displayName': '日本',
                'language': 'zh',
                'displayLanguage': '中国語'
            }
        });
    });
    it('should return proper US info', function () {
        allowedLocales = ['en_US', 'default'];
        var currentLocale = {
            ID: 'en_US',
            displayCountry: 'United States',
            country: 'US',
            displayName: 'English (US)',
            language: 'en',
            displayLanguage: 'English'
        };
        var siteId = 'RefArch';
        var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);
        assert.deepEqual(localeModel, {
            'locale': {
                'countryCode': 'US',
                'currencyCode': 'USD',
                'localLinks': [],
                'name': 'United States',
                'displayName': 'English (US)',
                'language': 'en',
                'displayLanguage': 'English'
            }
        });
    });
    it('should return a currentCountry if currentLocale is not set', function () {
        var currentLocale = {
            ID: '',
            displayCountry: '',
            country: '',
            displayName: '',
            language: '',
            displayLanguage: ''
        };
        var siteId = 'RefArch';
        var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);
        assert.deepEqual(localeModel, {
            'locale': {
                'countryCode': '',
                'currencyCode': 'USD',
                'name': '',
                'displayName': '',
                'language': '',
                'displayLanguage': '',
                'localLinks': [{
                    'country': 'US',
                    'currencyCode': 'USD',
                    'displayCountry': 'United States',
                    'displayLanguage': 'English',
                    'displayName': 'English (US)',
                    'language': 'en',
                    'localID': 'en_US'
                }
                ]
            }
        });
    });
});
