'use strict';
import _ from 'lodash';
import nodeUrl from 'url';
import * as header from '../pageObjects/header';
import * as checkoutPage from '../pageObjects/checkout';
import * as customers from '../customers';

export const defaultLocale = 'x_default';
export const supportedLocales = [
    'en_US'
    // 'en_GB',
    // 'fr_FR',
    // 'it_IT',
    // 'ja_JP',
    // 'zh_CN'
];
export const PRIMARY_CONTENT = '.container';
export const CATEGORYSLOT = '.category-slot .category-tile';
var jQuery;

/**
 *
 * @param selector1: the largeScreen selector
 * @param selector2: the smallScreen selector
 * @returns {*|Promise.<TResult>}
 */
export function getVisibleSelector(selector1, selector2) {
    let mySelector;
    return browser.isVisible(selector1)
        .then(visible => {
            if (visible) {
                mySelector = selector1;
                return mySelector;
            }
            mySelector = selector2;
            return mySelector;
        });
}

export function selectAttributeByIndex(attributeName, index) {
    let selector = '[data-attr = ' + attributeName + '] a:nth-child(' + index + ') span';
    return browser.waitForVisible(selector)
    // TODO:Before clicking on an attribute value, we must check whether it has already been selected.
        .then(() => {
            return browser.click(selector)
                .waitForVisible('[data-attr = ' + attributeName + ']');
        });
}

export function selectAttributeByDropDown(attributeName, index) {
    let selector = '.select-' + attributeName;
    return browser.waitForVisible(selector)
        .then(() => browser.selectByIndex(selector, index))
        .then(() => browser.pause(1000));
}

// function isAttributeSelected(selector) {
//     return browser.getAttribute(selector, 'data-selected')
//         .then(selected => Promise.resolve(selected));
// }

/**
 * Adds a Product Variation to a Basket
 *
 * @param {Map} product Product Map comprised of the following:
 * @param {String} product.resourcePath - Product Detail Page URL resource path
 * @param {Number} [product.colorIndex] - If product variations with Color,
 *     this represents the index value for the color options
 * @param {number} [product.sizeIndex]  - If product variations with Size,
 *     this represents the index value for the size options
 * @param {String} btnAdd - selector for Add to { Cart | Wishlist | Registry } button
 */
export function addProductVariationToBasket(product, btnAdd) {
    return browser.url(product.get('resourcePath'))
        .then(() => {
            if (product.has('colorIndex')) {
                return selectAttributeByIndex('color', product.get('colorIndex'));
            }
            return Promise.resolve();
        })
        .then(() => {
            if (product.has('sizeIndex')) {
                return selectAttributeByDropDown('size', product.get('sizeIndex'));
            }
            return Promise.resolve();
        })
        .then(() => {
            if (product.has('widthIndex')) {
                return selectAttributeByDropDown('width', product.get('widthIndex'));
            }
            return Promise.resolve();
        })
        .then(() => {
            return browser.waitForEnabled(btnAdd, 1000)
                .click(btnAdd);
        })
        .then(() => Promise.resolve());
}

export function convertToUrlFormat(inString) {
    let dotRemovedStr = inString;
    if (inString.endsWith('.')) {
        dotRemovedStr = inString.substr(0, inString.length - 1);
    }
    return dotRemovedStr.toLowerCase().replace(/ /g, '-');
}

export function convertHTTPsToHTTP(url) {
    return url.replace('https', 'http');
}

export function waitUntilPageLoaded() {
    return browser.waitUntil(() => {
        return browser.execute(() => document.readyState)
            .then(loaded => loaded.value === 'complete');
    }, 5000);
}

export function waitUntilAjaxCallEnded() {
    return browser.waitUntil(() => {
        return browser.execute(() => jQuery.active)
            .then(loaded => loaded.value === 0);
    }, 5000);
}

export function getSearchParams() {
    return browser.url()
        .then(url => {
            let parsedUrl = nodeUrl.parse(url.value);
            let search = parsedUrl.search ? parsedUrl.search.replace('?', '') : '';
            let params = _.fromPairs(
                _.map(search.split('&amp;'), param => param.split('='))
            );
            return Promise.resolve(params);
        });
}

/**
 * Since Quick View is only support on desktop and iPad-landscape mode,
 * this function determines if Quick View should be expected base
 * on whether the existing of the mobile menu.
 * (Note: We have decided that this is the best approach for now.)
 * return true - Quick View is expected to be present
 * return false - Quick View is NOT expected to be present
 *
 * @return {boolean}
 */
export function isQuickViewExpected() {
    return browser.isVisible(header.NAV_BAR_TOGGLER)
        .then(navBarVisible => {
            if (navBarVisible) {
                return false;
            }
            return true;
        });
}

/**
 * This function return current UTC date in the format "Mon DD, YYYY"
 * It can be extend to return other format as needed in the future.
 *
 * @return {String}
 */
export function getCurrentUTCDate() {
    const monthnames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const todayDate = new Date();
    const currDate = todayDate.getUTCDate();
    const currMonth = todayDate.getUTCMonth();
    const currYear = todayDate.getUTCFullYear();
    return monthnames[currMonth] + ' ' + currDate + ', ' + currYear;
}

/**
 * This function will create a shipping data object needed for filling
 * the shipping form in checkout. This function required information
 * from testDataMgr.
 *
 * @param {object} customer an object obtained from testDataMgr.getCustomerByLogin(userEmail)
 * @param {String} locale locale of the site
 *
 * @return {object}
 */
export function createShippingData(customer, locale) {
    const shippingData = {};

    let address = customer.getPreferredAddress();
    address.postalCode = customers.globalPostalCode[locale];
    address.countryCode = customers.globalCountryCode[locale];
    address.phone = customers.globalPhone[locale];

    shippingData[checkoutPage.SHIPPING_FIRST_NAME] = customer.firstName;
    shippingData[checkoutPage.SHIPPING_LAST_NAME] = customer.lastName;
    shippingData[checkoutPage.SHIPPING_ADDRESS_ONE] = address.address1;
    shippingData[checkoutPage.SHIPPING_COUNTRY] = address.countryCode;
    shippingData[checkoutPage.SHIPPING_ADDRESS_CITY] = address.city;
    shippingData[checkoutPage.SHIPPING_ZIP_CODE] = address.postalCode;
    shippingData[checkoutPage.SHIPPING_PHONE_NUMBER] = address.phone;

    if (locale && locale === 'x_default') {
        shippingData[checkoutPage.SHIPPING_STATE] = address.stateCode;
    }

    return shippingData;
}

export function createShippingDataWithAddress2(locale) {
    const shippingData = {};

    shippingData[checkoutPage.SHIPPING_FIRST_NAME] = 'Jane';
    shippingData[checkoutPage.SHIPPING_LAST_NAME] = 'Smith';
    shippingData[checkoutPage.SHIPPING_ADDRESS_ONE] = '22 Spring Road';
    shippingData[checkoutPage.SHIPPING_ADDRESS_TWO] = 'unit 6';
    shippingData[checkoutPage.SHIPPING_COUNTRY] = customers.globalCountryCode[locale];
    shippingData[checkoutPage.SHIPPING_ADDRESS_CITY] = 'Nashua';
    shippingData[checkoutPage.SHIPPING_ZIP_CODE] = customers.globalPostalCode2[locale];
    shippingData[checkoutPage.SHIPPING_PHONE_NUMBER] = customers.globalPhone2[locale];

    if (locale && locale === 'x_default') {
        shippingData[checkoutPage.SHIPPING_STATE] = 'NH';
    }

    return shippingData;
}

export function createBillingData(locale) {
    const billingData = {};

    billingData[checkoutPage.BILLING_FIRST_NAME] = 'Mommy';
    billingData[checkoutPage.BILLING_LAST_NAME] = 'Dear';
    billingData[checkoutPage.BILLING_ADDRESS_ONE] = '10 Marble Road';
    billingData[checkoutPage.BILLING_COUNTRY] = customers.globalCountryCode[locale];
    billingData[checkoutPage.BILLING_ADDRESS_CITY] = 'Bath';
    billingData[checkoutPage.BILLING_ZIP_CODE] = customers.globalPostalCode2[locale];

    if (locale && locale === 'x_default') {
        billingData[checkoutPage.BILLING_STATE] = 'ME';
    }

    return billingData;
}

/**
 * This function will create a payment data object needed for filling
 * the payment form in checkout. This function required information
 * from testDataMgr.
 *
 * @param {object} creditCard an object obtained from testDataMgr.creditCard1
 *
 * @return {object}
 */
export function createPaymentData(creditCard) {
    const paymentData = {};

    const nextYear = new Date().getFullYear() + 1;
    const creditCardExpiredYear = nextYear.toString();

    const creditCardExpiredMonth = 12;
    const paymentPhone = '781-425-1010';
    const paymentEmail = 'luckyOne@home.com';

    paymentData[checkoutPage.PAYMENT_CARD_NUMBER] = creditCard.number;
    paymentData[checkoutPage.PAYMENT_EXPIRATION_MONTH] = creditCardExpiredMonth;
    paymentData[checkoutPage.PAYMENT_EXPIRATION_YEAR] = creditCardExpiredYear;
    paymentData[checkoutPage.PAYMENT_SECURITY_CODE] = creditCard.cvn;
    paymentData[checkoutPage.PAYMENT_PHONE_NUMBER] = paymentPhone;
    paymentData[checkoutPage.PAYMENT_EMAIL] = paymentEmail;

    return paymentData;
}

export function checkCheckbox(selector) {
    return browser.click(selector)
        .isSelected(selector)
        .then(selected => {
            if (!selected) {
                return browser.click(selector);
            }
            return Promise.resolve();
        });
}

export function uncheckCheckbox(selector) {
    return browser.click(selector)
        .isSelected(selector)
        .then(selected => {
            if (selected) {
                return browser.click(selector);
            }
            return Promise.resolve();
        });
}
