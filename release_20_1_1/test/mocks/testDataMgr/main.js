'use strict';

import _ from 'lodash';
import fs from 'fs';
import moment from 'moment-timezone';
import xml2js from 'xml2js';

import * as customers from './customers.js';
import * as products from './products.js';
import * as prices from './prices.js';
import * as pricingHelpers from './helpers/pricing';
import * as promotions from './promotions.js';

export const defaultPassword = 'Test123!';
export const creditCard1 = {
    cardType: 'Visa',
    number: '4111111111111111',
    yearIndex: getCurrentYear() + 1,
    cvn: 987
};
export const creditCard2 = {
    cardType: 'Discover',
    number: '6011111111111117',
    yearIndex: getCurrentYear() + 1,
    cvn: 987
};

let demoDataDir = 'mobilefirstdata/demo_data_mfra';
let subjectMeta = {
    customers: {
        files: [demoDataDir + '/sites/MobileFirst/customers.xml'],
        processor: customers.parseCustomers
    },
    catalog: {
        files: [
            demoDataDir + '/catalogs/electronics-catalog/catalog.xml',
            demoDataDir + '/catalogs/apparel-catalog/catalog.xml',
            demoDataDir + '/catalogs/storefront-catalog-en/catalog.xml',
            demoDataDir + '/catalogs/storefront-catalog-non-en/catalog.xml'
        ],
        processor: products.parseCatalog
    },
    pricebooks: {
        files: [
            demoDataDir + '/pricebooks/cny-list-prices.xml',
            demoDataDir + '/pricebooks/cny-sale-prices.xml',
            demoDataDir + '/pricebooks/eur-list-prices.xml',
            demoDataDir + '/pricebooks/eur-sale-prices.xml',
            demoDataDir + '/pricebooks/gbp-list-prices.xml',
            demoDataDir + '/pricebooks/gbp-sale-prices.xml',
            demoDataDir + '/pricebooks/jpy-list-prices.xml',
            demoDataDir + '/pricebooks/jpy-sale-prices.xml',
            demoDataDir + '/pricebooks/usd-list-prices.xml',
            demoDataDir + '/pricebooks/usd-sale-prices.xml'
        ],
        processor: prices.parsePriceBooks
    },
    promotions: {
        files: [
            demoDataDir + '/sites/MobileFirst/promotions.xml',
            demoDataDir + '/sites/MobileFirstGlobal/promotions.xml'
        ],
        processor: promotions.parsePromotions
    }
};

const standardProductId = '750518548296';
const variationMasterProductId = '25604455';
const setProductId = 'spring-look';
const bundleProductId = 'microsoft-xbox360-bundle';

export let parsedData = {};

/**
 * Load and parse XML demo data to JSON.  If parsedDataFile file exists, just read and parse data, then assign to
 * parsedData module object.  If not exists, process demo data XML files then write to parsedDataFile.
 *
 * @returns {Promise} - Indicates when data has been loaded and processed
 */
export function load() {
    return new Promise(resolve => {
        let promises = [];

        parsedData = {};

        Object.keys(subjectMeta).forEach(subject => {
            promises.push(loadAndJsonifyXmlData(subject));
        });

        return Promise.all(promises).then(() => resolve());
    });
}

function loadAndJsonifyXmlData(subject) {
    return new Promise((resolve) => {
        let localPromises = [];
        parsedData[subject] = Object.hasOwnProperty.call(parsedData, subject) ? parsedData[subject] : {};
        subjectMeta[subject].files.forEach(file => {
            localPromises.push(new Promise(innerResolve =>
                fs.readFile(file, (err, data) => {
                    let parser = xml2js.Parser();
                    parser.parseString(data, (err, result) => {
                        // file is an optional processor parameter
                        parsedData[subject] = subjectMeta[subject].processor(result, parsedData[subject], file);
                        innerResolve(parsedData[subject]);
                    });
                })
            ));
        });
        resolve(Promise.all(localPromises));
    });
}

/* PRODUCTS */

/**
 * Returns a Promise that returns a JSON object of a specific product's test data
 *
 * @param {String} productId - product ID
 * @returns {Object} - JSON object of product
 */
export function getProductById(productId) {
    var product = products.getProduct(parsedData.catalog, productId);

    switch (product.type) {
        case 'variationMaster':
            product.variants = product.getVariantProductIds().map(variantId =>
                products.getProduct(parsedData.catalog, variantId)
            );
            break;
        case 'standard':
            product.master = products.getVariantParent(parsedData.catalog, productId);
            break;
        default:
            // eslint wants a default case, hence this break
            break;
    }

    return product;
}

/**
 * Returns a Promise that returns a Product Standard instance
 *
 * @returns {Object} - ProductStandard instance
 */
export function getProductStandard() {
    return getProductById(standardProductId);
}

/**
 * Returns a Promise that returns a ProductVariationMaster instance
 *
 * @returns {Object} - ProductVariationMaster instance
 */
export function getProductVariationMaster() {
    return getProductById(variationMasterProductId);
}

/**
 * Returns a Promise that returns a ProductSet instance
 *
 * @returns {Object} - ProductSet instance
 */
export function getProductSet() {
    return getProductById(setProductId);
}

/**
 * Returns a Promise that returns a ProductBundle instance
 *
 * @returns {Object} - ProductBundle instance
 */
export function getProductBundle() {
    return getProductById(bundleProductId);
}

/* CUSTOMERS */

/**
 * Returns a Promise that returns a JSON object of a specific customer's test data
 *
 * @param {String} login - test customer's login value
 * @returns {Promise.Object} - JSON object with Customer's test data
 */
export function getCustomerByLogin(login) {
    return customers.getCustomer(parsedData.customers, login);
}

/* PRICES */

/**
 * Returns a JSON object with a specific product's prices test data
 *
 * @param {String} productId - product ID
 * @param {String} [locale=x_default] - page locale
 * @returns {Object} - prices
 */
export function getPricesByProductId(productId, locale = 'x_default') {
    const normalizedLocale = locale.replace(/_/g, '-');
    const currencyCode = pricingHelpers.localeCurrency[normalizedLocale].currencyCode;
    const product = getProductById(productId);
    let applicablePricebooks = {};

    prices.priceTypes.forEach(type => {
        const pricebookName = [currencyCode, type, 'prices'].join('-');
        applicablePricebooks[type] = parsedData.pricebooks[pricebookName];
    });

    switch (product.type) {
        case 'set':
            return getPricesForProductSet(productId, locale);
        case 'variationMaster':
            return getPricesForVariationMaster(productId, locale);
        case 'standard':
            return getPricesForStandardProduct(applicablePricebooks, productId, locale);
        case 'bundle':
            return getPricesForProductBundle(applicablePricebooks, productId, locale);
        default:
            return {};
    }
}

function getPricesForStandardProduct(pricebooks, productId, locale = 'x_default') {
    let priceResults = {};

    prices.priceTypes.forEach(type => {
        let entry = _.find(pricebooks[type].products, { productId: productId });

        if (entry) {
            const localizedNumber = pricingHelpers.localizeNumber(entry.amount, locale);
            priceResults[type] = pricingHelpers.getFormattedPrice(localizedNumber, locale);
        }
    });

    return priceResults;
}

function getPricesForVariationMaster(productId, locale = 'x_default') {
    const variationMaster = getProductById(productId);
    let priceResults = {};

    variationMaster.getVariantProductIds().forEach(variantId => {
        let variantPrices = getPricesByProductId(variantId, locale);
        prices.priceTypes.forEach(type => {
            if (variantPrices[type]) {
                let variantPrice = pricingHelpers.getCurrencyValue(variantPrices[type], locale);
                let priceResult = Object.hasOwnProperty.call(priceResults, type)
                    ? pricingHelpers.getCurrencyValue(priceResults[type], locale)
                    : undefined;
                priceResults[type] = !priceResult || variantPrice < priceResult
                    ? pricingHelpers.getFormattedPrice(variantPrices[type], locale)
                    : pricingHelpers.getFormattedPrice(priceResults[type], locale);
            }
        });
    });

    return priceResults;
}

function getPricesForProductSet(productId, locale = 'x_default') {
    let productSet = getProductById(productId);
    let price = 0.00;

    productSet.getProductIds().forEach(productSetItemProductId => {
        let productSetItemPrices = getPricesByProductId(productSetItemProductId, locale);
        let values = _.values(productSetItemPrices);
        values = values.map(value => pricingHelpers.getCurrencyValue(value, locale));
        price += _.min(values);
    });

    return pricingHelpers.getFormattedPrice(price.toString(), locale);
}

function getPricesForProductBundle(pricebooks, productId, locale = 'x_default') {
    let entry = _.find(pricebooks.list.products, { productId: productId });
    return pricingHelpers.getFormattedPrice(entry.amount, locale);
}

export function getVariationMasterInstances() {
    return products.getVariationMasters(parsedData.catalog.products);
}

/* PROMOTIONS */

/**
 * Promotions are Site-specific, so we need to specify the Site when calling functions that retrieve them.  If not
 * specified, we default to "MobileFirst".  There is a getCurrentSiteName() helper function in helpers/common.js.
 *
 */
const defaultSite = 'MobileFirst';

export function getPromotionById(id, site = defaultSite) {
    return promotions.getPromotion(parsedData.promotions[site].promotions, id);
}

export function getPromotionCampaignById(id, site = defaultSite) {
    return promotions.getCampaign(parsedData.promotions[site].campaigns, id);
}

export function getPromotionCampaignAssignmentById(promotionId, campaignId, site = defaultSite) {
    return promotions.getPromotionCampaignAssignment(parsedData.promotions[site].promotionCampaignAssignments, promotionId, campaignId);
}

/* Helper Methods for this module only */
function getCurrentYear() {
    return moment(new Date()).year();
}
