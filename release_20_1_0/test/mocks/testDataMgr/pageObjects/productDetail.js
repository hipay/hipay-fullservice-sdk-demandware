'use strict';

import * as common from '../helpers/common';

export const BTN_ADD_TO_CART = '.btn-primary';
export const MINI_CART = '.minicart-total';
export const PRODUCT_NAME = '.product-name hidden-sm-down';
export const PRODUCT_NAME_SMALL = '.product-detail';
export const PRODUCT_GRID = '.container .product-grid';
export const PROMOTIONS = '.promotions';
export const PROMOTION_CALLOUT = PROMOTIONS + ' .callout';


function addProduct(product, btnAdd) {
    return common.addProductVariationToBasket(product, btnAdd);
}

export function addProductVariationToCart(product) {
    return addProduct(product, BTN_ADD_TO_CART, MINI_CART)
        // To ensure that the product has been added to the cart before proceeding,
        // we need to wait for the Mini-cart to display
    .then(() => browser.waitForVisible(MINI_CART));
}

export function clickAddToCartButton() {
    return browser.waitForVisible('.loader-bg', 3000, true)
        .waitForVisible(BTN_ADD_TO_CART)
        .waitForEnabled(BTN_ADD_TO_CART)
        .click(BTN_ADD_TO_CART)
        .then(() => browser.waitForVisible(MINI_CART));
}

