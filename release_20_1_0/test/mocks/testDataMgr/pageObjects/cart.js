'use strict';

export const BTN_DELETE = '.card button.remove-btn';
export const BTN_CHECKOUT = '.checkout-btn';
export const DELETE_CONFIRMATION = '.delete-confirmation-btn';
export const CART_EMPTY = '.text-center h1';
export const CART_ITEMS = '.card';
export const ITEM_QUANTITY = '.quantity';
export const NUMBER_OF_ITEMS = '.number-of-items';
export const SHIPPING_COST = '.shipping-cost';
export const TAX_TOTAL = '.tax-total';
export const GRAND_TOTAL = '.grand-total';
export const SHIPPING_METHODS = '.shippingMethods';
export const SHIPPING_METHOD_OPTIONS = '.shippingMethods  > option';

// Pseudo private methods
function createCssNthCartRow(idx) {
    return CART_ITEMS + ':nth-child(' + idx + ')';
}

export function createCssNthLineItem(itemIdx, attrIdx) {
    var LINE_ITEM = ' .line-item-attributes';
    var selector = '.card:nth-child(' + itemIdx + ')' + LINE_ITEM + ':nth-child(' + attrIdx + ')';
    return browser.getText(selector);
}

// Public methods
export function navigateTo() {
    return getCartURL()
        .then(cartUrl => browser.url(cartUrl));
}

export function getCartURL() {
    let selector = '.minicart-link';
    return browser.waitForVisible(selector)
        .then(() => browser.getAttribute(selector, 'href'));
}

export function verifyCartEmpty() {
    return browser.getText(CART_EMPTY);
}

export function getItemList() {
    return browser
        .waitForExist(CART_ITEMS, 6000)
        .elements(CART_ITEMS);
}

export function getItemNameByRow(rowNum) {
    let selector = createCssNthCartRow(rowNum) + ' .line-item-name';
    return browser.waitForVisible(selector)
        .getText(selector);
}

// get the quantity in Cart for a particular product line item
export function getQuantityByRow(rowNum) {
    var selector = [createCssNthCartRow(rowNum), ITEM_QUANTITY].join(' ');
    return browser.getValue(selector);
}

export function updateQuantityByRow(rowNum, value) {
    let selector = [createCssNthCartRow(rowNum), ITEM_QUANTITY].join(' ');
    return browser.waitForVisible(selector)
        .selectByVisibleText(selector, value)
        .pause(1000)
        .getValue(selector);
}

export function getEachPriceByRow(rowNum) {
    let selector = createCssNthCartRow(rowNum) + ' .price .sales .value';
    return browser.getText(selector);
}

export function getTotalPriceByRow(rowNum) {
    let selector = createCssNthCartRow(rowNum) + ' .line-item-total-price-amount';
    return browser.getText(selector);
}

/**
 * return a boolean indicating whether the option at the specified index is selected.
 * @param {number} index, list index start with 1
 * @returns {boolean} true if the option at the specified index is selected, false otherwise
 */
export function isShippingMethodSelectedAtIndex(index) {
    let selector = SHIPPING_METHOD_OPTIONS + ':nth-child(' + index + ')';
    return browser.isSelected(selector);
}

/**
 * return the shipping method.
 * @param {number} index, list index start with 1
 * @returns {string} the shipping method at the specified index
 */
export function getShippingMethodAtIndex(index) {
    let selector = SHIPPING_METHOD_OPTIONS + ':nth-child(' + index + ')';
    return browser.getText(selector);
}

/**
 * Find the selector that applicable to the current screen
 * @param {string} selector
 * @returns {Promise.<TResult>|*}
 */
function getDeleteItemSelector(selector) {
    return browser.isVisible(selector)
        .then(isVisible => {
            if (Array.isArray(isVisible)) {
                if (isVisible[0] === true) {
                    return selector;
                }
                return selector + '-lg';
            } else if (isVisible) {
                return selector;
            }
            return selector + '-lg';
        });
}
/**
 * Remove all items in Cart
 * @returns {Promise.<TResult>}
 */
export function emptyCart() {
    var mySelector;
    return navigateTo()
        .then(() => getDeleteItemSelector(BTN_DELETE))
        .then(selector => {
            mySelector = selector;
            return browser.elements(mySelector);
        })
        .then(removeLinks => {
            return removeLinks.value.reduce(removeItem => {
                return removeItem.then(() => browser.click(mySelector))
                    .then(() => browser.waitForVisible(DELETE_CONFIRMATION, 2000))
                    .then(() => browser.click(DELETE_CONFIRMATION))
                    .then(() => browser.pause(2000))
                    .then(() => browser.isVisible(DELETE_CONFIRMATION))
                    .then(isVisible => {
                        if (isVisible) {
                            return browser.click('.modal-content .close');
                        }
                        return Promise.resolve();
                    })
                    .then(() => browser.pause(2000));
            }, Promise.resolve());
        });
}
