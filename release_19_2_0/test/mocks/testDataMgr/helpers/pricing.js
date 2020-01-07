'use strict';

const globalize = require('globalize');
const cldrData = require('cldr-data');
globalize.load(cldrData.entireSupplemental());
globalize.load(cldrData.entireMainFor('en', 'en-GB', 'en-US-POSIX', 'fr', 'it', 'ja', 'zh'));

export const localeCurrency = {
    'x-default': {
        currencyCode: 'usd',
        symbol: '$'
    },
    'en-US': {
        currencyCode: 'usd',
        symbol: '$'
    },
    'en-GB': {
        currencyCode: 'gbp',
        symbol: '£'
    },
    'fr-FR': {
        currencyCode: 'eur',
        symbol: '€'
    },
    'it-IT': {
        currencyCode: 'eur',
        symbol: '€'
    },
    'ja-JP': {
        currencyCode: 'jpy',
        symbol: '¥'
    },
    'zh-CN': {
        currencyCode: 'cny',
        symbol: '¥'
    }
};

/**
 * Parses a localized currency value
 *
 * @param {String} price
 * @param {String} [locale]
 * @returns {Number}
 */
export function getCurrencyValue(price, locale = 'en-US') {
    const normalizedLocale = normalizeLocale(locale);
    const normalizedPrice = price.replace(/[^0-9-.,]/g, '');

    return globalize(normalizedLocale).numberParser()(normalizedPrice);
}

/**
 * Returns a locale-formatted price
 *
 * @param {String} price
 * @param {String} [locale]
 * @returns {String} - Formatted price
 */
export function getFormattedPrice(price, locale = 'en-US') {
    const normalizedLocale = normalizeLocale(locale);
    const currencyCode = localeCurrency[normalizedLocale].currencyCode.toUpperCase();
    const currencyValue = getCurrencyValue(price, normalizedLocale);

    globalize.locale(normalizedLocale);

    // Special handling for certain locales as globalize has some slight differences from how we render localize prices
    if (normalizedLocale === 'it-IT') {
        const amount = globalize.numberFormatter({
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })(currencyValue);

        return `${localeCurrency[normalizedLocale].symbol} ${amount}`;
    } else if (normalizedLocale === 'ja-JP') {
        const symbol = localeCurrency[normalizedLocale].symbol;
        const number = globalize.numberFormatter()(currencyValue, normalizedLocale);

        return `${symbol} ${number}`;
    } else if (normalizedLocale === 'zh-CN') {
        const number = globalize.numberFormatter({
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })(currencyValue, normalizedLocale);

        return `${localeCurrency[normalizedLocale].symbol}${number}`;
    }
    return globalize.currencyFormatter(currencyCode)(currencyValue);
}

export function getCurrencySymbol(locale = 'en-US') {
    return localeCurrency[normalizeLocale(locale)].symbol;
}

/**
 * Convert 'xx_XX' locales to 'xx-XX', which is the format that the cldr-data module requires
 *
 * @param {String} locale - 'xx_XX'
 * @returns {String} - 'xx-XX'
 */
function normalizeLocale(locale = 'en-US') {
    return locale.replace('_', '-');
}

/**
 * Return localized number, e.g. 23.99 ('en-US') -> 23,99 ('it-US')
 *
 * Background:  This function is primarily used for converting values from the pricebook demo data to a localized number.
 *   The eur-list-prices.xml file stores values as xx.xx, but Euro prices for fr-FR and it-IT are in xx,xx format
 *
 * @param {String} price - English number format xxxx.xx
 * @param {String} [locale]
 * @returns {String}
 */
export function localizeNumber(price, locale = 'en-US') {
    // price must be in xxxx.xx format
    const number = globalize('en').numberParser()(price);
    const localizedNumber = globalize(normalizeLocale(locale)).numberFormatter({
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })(number);

    return localizedNumber;
}

/**
 * return the price with the discount applied to it for a given promotion, this is for when using a percent off discount
 * @param argsObject - contains an object with 4 properties, pricingHelpers, promotionInfo, expectedSalePrice & locale
 * @param expectedSalePrice - the expected price
 * @param locale - the current local
 * @param promotionInfo.discountAmount - the percent to mark down the expectedSalePrice with
 * @returns {Number} - the expectedSalePrice with the promotionInfo.discountAmount applied to it
 */
export function getPercentageDiscountedPrice(expectedSalePrice, locale, discountAmount) {
    const price = getCurrencyValue(expectedSalePrice, locale);
    const discount = parseInt(discountAmount, 10) / 100;

    return price - (price * discount);
}
