'use strict';

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'pageTitle', {
        enumerable: true,
        value: apiProduct.pageTitle
    });

    Object.defineProperty(object, 'pageDescription', {
        enumerable: true,
        value: apiProduct.pageDescription
    });

    Object.defineProperty(object, 'pageKeywords', {
        enumerable: true,
        value: apiProduct.pageKeywords
    });

    Object.defineProperty(object, 'pageMetaTags', {
        enumerable: true,
        value: apiProduct.pageMetaTags
    });
};
