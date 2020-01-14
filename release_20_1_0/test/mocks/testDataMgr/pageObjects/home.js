'use strict';

export const productTile = '.product-tile';
export const imageContainer = '.imageContainer';
export const swatchCircle = '.swatches .swatch-circle';
export const cardTitle = '.card-title';
export const navNewArrival = 'a[href*="new%20arrivals"]';
export const navWomen = '.navbar .nav-item:nth-child(2)';
export const navMen = '.navbar .nav-item:nth-child(3)';
export const navElectronics = '.navbar .nav-item:nth-child(4)';
export const navTopSeller = '.navbar .nav-item:nth-child(5)';
export const navBarButton = '.navbar-toggler';
export const openDropDownTopCategory = '.dropdown.show .dropdown-menu .top-category';
export const navNewArrivalsButton = '#newarrivals';
export const navNewArrivalNewArrivalButton = openDropDownTopCategory + ' ' + navNewArrivalsButton;
export const navWomenButton = '#womens';
export const navWomenWomenButton = openDropDownTopCategory + ' ' + navWomenButton;
export const navMenButton = '#mens';
export const navMenMenButton = openDropDownTopCategory + ' ' + navMenButton;
export const navElectronicsButton = '#electronics';
export const navElectronicsElectronicsButton = openDropDownTopCategory + ' ' + navElectronicsButton;
export const navTopSellerButton = '#top-seller';
export const closeButton = '.close-button';
export const backButton = '.dropdown-menu .back .caret-left';
export const dropdownMenu = '.dropdown-menu';
export const navWomenClothingButton = '#womens-clothing';
export const navWomenClothingTopsButton = '#womens-clothing-tops';
export const navBar = '#sg-navbar-collapse';
export const signInButton = '.fa-sign-in';
export const signInButtonIpad = '.hidden-md-up .fa-sign-in';

const basePath = '/home';

function createCssNthProductTile(idx) {
    return productTile + ':nth-child(' + idx + ')';
}

export function navigateTo() {
    return browser.url(basePath);
}

export function getProductTileCount() {
    return browser.elements(productTile)
        .then(prodTiles => {
            return prodTiles.value.length;
        });
}

export function getNthProductTileImageSrc(tileIdx) {
    let selector = createCssNthProductTile(tileIdx) + ' ' + imageContainer + ' > a > img.card-img-top';
    return browser.waitForVisible(selector)
        .getAttribute(selector, 'src');
}

export function getNthProductTileImageHref(tileIdx) {
    let selector = createCssNthProductTile(tileIdx) + ' ' + imageContainer + ' > a:nth-child(1)';
    return browser.waitForVisible(selector)
        .getAttribute(selector, 'href');
}

export function getNthProductTileProductNameHref(tileIdx) {
    let selector = createCssNthProductTile(tileIdx) + ' ' + cardTitle;
    return browser.getAttribute(selector, 'href');
}

/**
 * Click on the color swatch of the product tile
 * @param {number} tileIdx, start with 1
 * @param {number} swatchIdx, start with 1
 * @returns {Promise.<TResult>|*}
 */
export function clickProductTileColorSwatch(tileIdx, swatchIdx) {
    let selector = createCssNthProductTile(tileIdx) + ' ' + swatchCircle + ':nth-child(' + swatchIdx + ')';

    return browser.waitForVisible(selector, 1000)
        .then(() => browser.click(selector));
}
