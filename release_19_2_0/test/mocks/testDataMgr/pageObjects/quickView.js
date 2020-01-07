'use strict';

export const QUICK_VIEW_DIALOG = '.quick-view-dialog';
export const ACTIVE_IMAGE = '.carousel-item.active .img-fluid';
export const NEXT_BUTTON = '.icon-next';
export const PRODUCT_NAME = '.product-name';
export const SELECTED_SWATCH_COLOR = '.swatch-value.selected';
export const SELECTED_SIZE = '.select-size option[selected]';
export const SELECTED_QUANTITY = '.quantity-select.custom-select.form-control';
export const PRICE = '.prices .price .sales .value';
export const ADD_TO_CART = '.add-to-cart-global';
export const CLOSE_BUTTON = '.modal-content .close';


export function getProductName() {
    let selector = PRODUCT_NAME;
    return browser.waitForVisible(selector)
        .getText(selector);
}

export function getSelectedSwatchColor() {
    let selector = SELECTED_SWATCH_COLOR;
    return browser.waitForVisible(selector)
        .getAttribute(selector, 'data-attr-value');
}

export function getSelectedSizeDataAttrValue() {
    let selector = SELECTED_SIZE;
    return browser.waitForVisible(selector)
        .getAttribute(selector, 'data-attr-value');
}

export function getSelectedQuantity() {
    let selector = SELECTED_QUANTITY;
    return browser.waitForVisible(selector)
        .getValue(selector);
}

export function getPrice() {
    let selector = PRICE;
    return browser.waitForVisible(selector)
        .getText(selector);
}

export function getActiveImageSrc() {
    let selector = ACTIVE_IMAGE;
    return browser.waitForVisible(selector)
        .getAttribute(selector, 'src');
}

export function clickOnNextImageIcon() {
    let initialActiveImageSrc;
    let nextBtnSelector = NEXT_BUTTON;

    return browser.waitForVisible(nextBtnSelector)
        .then(() => getActiveImageSrc())
        .then(activeImageSrc => {
            initialActiveImageSrc = activeImageSrc;
            return Promise.resolve();
        })
        .then(() => browser.click(nextBtnSelector))
        .then(() => {
            return browser.waitUntil(() => {
                return getActiveImageSrc()
                    .then(activeImageSrc => {
                        return activeImageSrc !== initialActiveImageSrc;
                    });
            }, 3000, 'expected Quickview image src to be different after clicking next');
        });
}

export function closeQuickview() {
    let selector = CLOSE_BUTTON;
    return browser.waitForVisible(selector)
        .click(selector)
        .waitForVisible(selector, 3000, true);
}
