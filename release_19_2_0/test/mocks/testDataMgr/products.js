'use strict';

import _ from 'lodash';
import * as common from './helpers/common';
import { AbstractDwModelMock } from './common';

let defaultLocale = common.defaultLocale;

/**
 * Processes parsed JSONified file data and sends back a map of Product
 *   instances
 *
 * @param {Object} fileData - Parsed data from XML files
 * @param {Object} [currentCatalog] - parsedData.catalog processed-to-date
 * @returns {Object} - Map of Product* instances grouped by Product IDs
 */
export function parseCatalog(fileData, currentCatalog) {
    let proxy = currentCatalog || {};
    proxy.categories = currentCatalog.categories || {};
    proxy.categoryAssignments = currentCatalog.categoryAssignments || {};
    proxy.products = currentCatalog.products || {};

    if (Object.hasOwnProperty.call(fileData.catalog, 'category')) {
        for (let category of fileData.catalog.category) {
            let id = category.$['category-id'];
            proxy.categories[id] = category;
        }
    }

    if (Object.hasOwnProperty.call(fileData.catalog, 'category-assignment')) {
        for (let categoryAssignment of fileData.catalog['category-assignment']) {
            let productId = categoryAssignment.$['product-id'];
            proxy.categoryAssignments[productId] = categoryAssignment;
        }
    }

    if (Object.hasOwnProperty.call(fileData.catalog, 'product')) {
        for (let product of fileData.catalog.product) {
            let id = product.$['product-id'];
            proxy.products[id] = Object.hasOwnProperty.call(proxy.products, id)
                ? _.merge(proxy.products[id], product)
                : product;
        }
    }

    return proxy;
}

/**
 * Gets a Product* instance by checking whether product is already an instance.  If yes, just return product.
 * If not, creates new instance from product properties.  New instance then has access to Class methods.
 *
 * @param {Object} catalog - JSON object of catalog data
 * @param {String} productId - Product ID
 * @returns {ProductStandard|ProductVariationMaster|ProductSet|ProductBundle} - product instance
 */
export function getProduct(catalog, productId) {
    const product = catalog.products[productId];
    const type = getProductType(product);

    switch (type) {
        case 'set':
            return new ProductSet(product, catalog);
        case 'variationMaster':
            return new ProductVariationMaster(product, catalog);
        case 'standard':
            return new ProductStandard(product, catalog);
        case 'bundle':
            return new ProductBundle(product, catalog);
        default:
            return null;
    }
}

export function getProductType(product) {
    if (isProductSet(product)) {
        return 'set';
    } else if (isProductVariationMaster(product)) {
        return 'variationMaster';
    } else if (isProductStandard(product)) {
        return 'standard';
    } else if (isProductBundle(product)) {
        return 'bundle';
    }
    return null;
}

export function isProductSet(product) {
    return Object.hasOwnProperty.call(product, 'product-set-products');
}

export function isProductVariationMaster(product) {
    return Object.hasOwnProperty.call(product, 'variations');
}

export function isProductBundle(product) {
    return Object.hasOwnProperty.call(product, 'bundled-products');
}

export function isProductStandard(product) {
    return !isProductSet(product) &&
        !isProductVariationMaster(product) &&
        !isProductBundle(product);
}

export function getVariationMasterInstances(catalogProducts) {
    return _.filter(catalogProducts, product => isProductVariationMaster(product));
}

/**
 * Retrieves product variation master of a variant
 *
 * @param {Object} catalog - parsedData.catalog.product
 * @param {String} variantId
 * @returns {ProductVariationMaster}
 */
export function getVariantParent(catalog, variantID) {
    const variationMasters = getVariationMasterInstances(catalog.products);
    const variantParent = _.find(variationMasters, master => {
        const variants = master.variations[0].variants;
        return variants ? _.some(variants[0].variant, { $: { 'product-id': variantID } }) : false;
    });

    return new ProductVariationMaster(variantParent, catalog);
}

export class Category {
    constructor(category) {
        this.parent = Object.hasOwnProperty.call(category, 'parent')
            ? category.parent[0]
            : undefined;
        this.displayName = getLocalizedValues(category['display-name']);
        this.position = Object.hasOwnProperty.call(category, 'position')
            ? category.position[0]
            : undefined;
        this.image = Object.hasOwnProperty.call(category, 'image') ? category.image[0] : undefined;
        this.template = Object.hasOwnProperty.call(category, 'template')
            ? category.template[0]
            : undefined;
        this.pageAttributes = parsePageAttrs(category['page-attributes'][0]);
    }

    getDisplayName(locale = defaultLocale) {
        let parsedLocale = locale;
        if (locale === 'en_GB') { parsedLocale = defaultLocale; }
        return this.displayName[parsedLocale];
    }

    getPageTitle(locale = defaultLocale) {
        return this.pageAttributes.pageTitle[locale];
    }

    getPageDescription(locale = defaultLocale) {
        return this.pageAttributes.pageDescription[locale];
    }
}

export class CategoryAssignment {
    constructor(assignment) {
        this.productId = assignment.$['product-id'];
        this.categoryId = assignment.$['category-id'];
    }
}

export class AbstractProductBase extends AbstractDwModelMock {
    constructor(product) {
        super(product);

        this.id = product.$['product-id'];
        this.type = getProductType(product);
        this.ean = product.ean[0];
        this.upc = product.upc[0];
        this.unit = product.unit[0];
        this.minOrderQuantity = Number(product['min-order-quantity'][0]);
        this.stepQuantity = Number(product['step-quantity'][0]);
        this.onlineFlag = Boolean(product['online-flag'][0]);
        this.availableFlag = Boolean(product['available-flag'][0]);
        this.searchableFlag = Boolean(product['searchable-flag'][0]);
        this.taxClassId = product['tax-export class-id'] ? product['tax-export class-id'][0] : null;

        if (_.size(product['online-from'])) {
            this.onlineFrom = new Date(product['online-from'][0]);
        }
        if (_.size(product.brand)) {
            this.brand = product.brand[0];
        }
        if (_.size(product['page-attributes'])) {
            this.pageAttributes = parsePageAttrs(product['page-attributes'][0]);
        }
        if (_.size(product['custom-attributes'])) {
            this.customAttributes = parseCustomAttrs(product['custom-attributes'][0]['custom-attribute']);
        }
        if (_.size(product.images)) {
            this.images = parseImages(product.images[0]);
        }

        if (Object.hasOwnProperty.call(product, 'display-name')) {
            this.displayName = getLocalizedValues(product['display-name']);
        }
        if (Object.hasOwnProperty.call(product, 'short-description')) {
            this.shortDescription = getLocalizedValues(product['short-description']);
        }
        if (Object.hasOwnProperty.call(product, 'long-description')) {
            this.longDescription = getLocalizedValues(product['long-description']);
        }
        if (Object.hasOwnProperty.call(product, 'classification-category')) {
            this.classificationCategory = product['classification-category'];
        }
        if (Object.hasOwnProperty.call(product, 'options')) {
            this.options = parseOptions(product.options);
        }
    }

    toString() {
        return JSON.stringify(this);
    }

    /**
     * Retrieve first image matching size and attribute value
     *
     * @param {String} viewType - image size, typically 'large' for primary images and 'small' for thumbnails
     * @param {String} attrValue - attribute value
     * @returns {String} Image path value, i.e., 'large/PG.15J0037EJ.WHITEFB.PZ.jpg'
     */
    getImage(viewType, attrValue) {
        return this.getImages(viewType, attrValue)[0];
    }

    /**
     * Retrieve images matching size and attribute value
     *
     * @param {String} viewType - image size, typically 'large' for primary images and 'small' for thumbnails
     * @param {String} attrValue - attribute value
     * @returns {Array.<String>} Image path values, i.e., ['small/PG.15J0037EJ.SLABLFB.PZ.jpg', small/PG.15J0037EJ.SLABLFB.BZ.jpg]
     */
    getImages(viewType, attrValue) {
        return _.find(this.images, { viewType: viewType, variationValue: attrValue }).paths;
    }
}

export class ProductStandard extends AbstractProductBase {
    constructor(product) {
        super(product);

        // Assigned when testData/main:getProductById is called
        this.master = undefined;
    }

    getUrlResourcePath(locale = defaultLocale) {
        const pageUrl = this.master.getPageUrl(locale);
        return `/${pageUrl}/${this.id}.html?lang=${locale}`;
    }

    getDisplayName(locale = defaultLocale) {
        let parsedLocale;
        if (locale === 'en_GB') { parsedLocale = defaultLocale; }
        return this.master.displayName[parsedLocale];
    }
}

export class ProductSet extends AbstractProductBase {
    constructor(product, catalog) {
        super(product);

        let productSet = product['product-set-products'][0]['product-set-product'];
        this.productSetProducts = _.map(productSet, '$.product-id') || [];
        this.urlResourcePaths = generateUrlResourcePaths(catalog, this.id);
    }

    getUrlResourcePath(locale = 'en_US') {
        return `${this.urlResourcePaths[locale]}/${this.id}.html?lang=${locale}`;
    }

    getDisplayName(locale = defaultLocale) {
        return this.displayName[locale];
    }

    getProductIds() {
        return this.productSetProducts;
    }

    getProducts(catalog) {
        return this.getProductIds().map(id => getProduct(catalog, id));
    }

}

export class ProductVariationMaster extends AbstractProductBase {
    constructor(product, catalog) {
        super(product);

        this.variationAttributes = {};
        // Populated when testData/main:getProductById is called
        this.variants = [];
        let self = this;
        let mainKey;

        let variationAttrs = product.variations[0].attributes[0]['variation-attribute'];

        _.each(variationAttrs, value => {
            let proxy = {};
            proxy.values = [];

            _.each(value.$, (val, key) => {
                proxy[_.camelCase(key)] = val;
                if (key === 'attribute-id') {
                    mainKey = val;
                }
            });

            _.each(value['variation-attribute-values'][0]['variation-attribute-value'], val => {
                proxy.values.push({
                    value: val.$.value,
                    displayValues: getLocalizedValues(val['display-value'])
                });
            });

            self.variationAttributes[mainKey] = proxy;
        });

        let categoryAssignmentJSON = catalog.categoryAssignments[this.id];
        let categoryAssignment = new CategoryAssignment(categoryAssignmentJSON);
        this.classificationCategory = categoryAssignment.categoryId;

        if (Object.hasOwnProperty.call(product.variations[0], 'variants')) {
            this.variantIds = _.map(product.variations[0].variants[0].variant, '$.product-id');
        }
    }

    /**
     * Returns a product's localized pageUrl
     *
     * @param {String} locale
     * @returns {String} - localized pageUrl
     */
    getPageUrl(locale = defaultLocale) {
        return this.pageAttributes.pageUrl[locale];
    }

    getUrlResourcePath(locale = defaultLocale) {
        const path = this.getPageUrl(locale);
        const urlLocale = locale !== defaultLocale ? locale : 'en_US';
        return `/${path}/${this.id}.html?lang=${urlLocale}`;
    }

    getVariantProductIds() {
        return this.variantIds;
    }

    getAttrTypeValueIndex(type, value) {
        return _.findIndex(this.variationAttributes[type].values, { value: value });
    }

    getAttrDisplayValue(type, codedValue, locale = defaultLocale) {
        let attrValues = _.find(this.variationAttributes[type].values, { value: codedValue });
        let parsedLocale = validateLocale(attrValues.displayValues, locale);
        return attrValues ? attrValues.displayValues[parsedLocale] : undefined;
    }

    getAttrTypes() {
        return Object.keys(this.variationAttributes);
    }

    getAttrValuesByType(type) {
        let definedValues = _.map(this.variationAttributes[type].values, 'value');
        let implementedValues = this.variants.map(variant => {
            if (variant.onlineFlag && variant.availableFlag) {
                return variant.customAttributes[type];
            }
            return null;
        });

        return _.intersection(definedValues, _.unique(implementedValues));
    }
}

export class ProductBundle extends AbstractProductBase {
    constructor(product, catalog) {
        super(product);

        let bundleProducts = product['bundled-products'][0]['bundled-product'];
        this.bundleProducts = _.map(bundleProducts, '$.product-id');
        this.urlResourcePaths = generateUrlResourcePaths(catalog, this.id);
    }

    getProductIds() {
        return this.bundleProducts;
    }

    getProducts(catalog) {
        return this.getProductIds().map(id => getProduct(catalog, id));
    }

    getOptions() {
        return this.options || [];
    }

    getUrlResourcePath(locale = 'en_US') {
        return `${this.urlResourcePaths[locale]}/${this.id}.html?lang=${locale}`;
    }

    getImage(viewType) {
        let imgagePath = '';
        let i;

        for (i = 0; i < this.images.length; i++) {
            if (this.images[i].viewType === viewType) {
                imgagePath = this.images[i].paths;
                break;
            }
        }
        return imgagePath;
    }
}

function parseImages(images) {
    let imageList = images['image-group'];
    let parsed = [];

    imageList.forEach(image => {
        let proxy = {
            viewType: image.$['view-type'],
            variationValue: image.$['variation-value'] || undefined,
            paths: []
        };

        image.image.forEach(path => {
            proxy.paths.push(path.$.path);
        });

        parsed.push(proxy);
    });

    return parsed;
}

function parsePageAttrs(attrs) {
    return _.fromPairs(_.map(attrs, (attr, key) => [_.camelCase(key), getLocalizedValues(attr)]));
}

function parseCustomAttrs(attrs) {
    return _.fromPairs(_.map(attrs, attr => [attr.$['attribute-id'], attr._]));
}

function parseOptions(options) {
    return _.map(options, 'shared-option[0].$.option-id');
}

function getLocalizedValues(values) {
    return _.fromPairs(_.map(values, value => {
        // Format key to match country code values in countries.json
        let key = value.$['xml:lang'].replace('-', '_');
        return [key, value._];
    }));
}

function validateLocale(values, locale) {
    return _.keys(values).indexOf(locale) > -1 ? locale : defaultLocale;
}

function generateUrlResourcePaths(catalog, productId) {
    const categoryAssignmentJSON = catalog.categoryAssignments[productId];
    const categoryAssignment = new CategoryAssignment(categoryAssignmentJSON);
    const categoryJSON = catalog.categories[categoryAssignment.categoryId];
    let category = new Category(categoryJSON);
    let categoryParent = category.parent;
    let urlResourcePaths = {};

    function addUrlResourcePath(locale) {
        const currentPath = urlResourcePaths[locale] || '';
        const demoDataLocale = locale === 'en_GB' || locale === 'en_US' ? defaultLocale : locale;

        urlResourcePaths[locale] = `/${category.getDisplayName(demoDataLocale).toLowerCase()}${currentPath}`;
    }

    do {
        common.supportedLocales.forEach(addUrlResourcePath);
        category = new Category(catalog.categories[categoryParent]);
        categoryParent = category.parent;
    } while (categoryParent);

    return urlResourcePaths;
}
