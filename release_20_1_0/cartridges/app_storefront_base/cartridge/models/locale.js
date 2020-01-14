'use strict';

var countries = require('*/cartridge/config/countries');
var ApiLocale = require('dw/util/Locale');

/**
 * returns object needed to render links to change the locale of the site
 * @param {string} allowedLocales - list of allowed locales for the site
 * @param {string} siteId - id of the current site
 * @param {string} currentLocaleID - id of the current loale
 * @returns {Array} - array of Objects representing available locales
 */
function getLocaleLinks(allowedLocales, siteId, currentLocaleID) {
    var localeOption;
    var apiLocale;
    var localeOptions = [];

    countries.forEach(function (locale) {
        if (allowedLocales.indexOf(locale.id) > -1 && locale.id !== currentLocaleID) {
            apiLocale = ApiLocale.getLocale(locale.id);

            localeOption = {
                localID: locale.id,
                country: apiLocale.country,
                displayCountry: apiLocale.displayCountry,
                currencyCode: locale.currencyCode,
                displayName: apiLocale.displayName,
                language: apiLocale.language,
                displayLanguage: apiLocale.displayLanguage
            };
            localeOptions.push(localeOption);
        }
    });
    return localeOptions;
}

/**
 * Performs a deeper check on a plain locale object
 * @param {dw.util.Locale} currentLocale - current locale of the request
 * @return {boolean} - returns true
 */
function isLocaleValid(currentLocale) {
    return currentLocale && currentLocale.ID;
}

/**
 * Represents current locale information in plain object
 * @param {dw.util.Locale} currentLocale - current locale of the request
 * @param {string} allowedLocales - list of allowed locales for the site
 * @param {string} siteId - id of the current site
 * @constructor
 */
function Locale(currentLocale, allowedLocales, siteId) {
    var currentCountry = !isLocaleValid(currentLocale) ? countries[0]
        : countries.filter(function (country) {
            return country.id === currentLocale.ID;
        })[0];

    this.locale = {
        countryCode: currentLocale.country,
        name: currentLocale.displayCountry,
        localLinks: getLocaleLinks(allowedLocales, siteId, currentLocale.ID),
        currencyCode: currentCountry.currencyCode,
        displayName: currentLocale.displayName,
        language: currentLocale.language,
        displayLanguage: currentLocale.displayLanguage
    };
}

module.exports = Locale;
