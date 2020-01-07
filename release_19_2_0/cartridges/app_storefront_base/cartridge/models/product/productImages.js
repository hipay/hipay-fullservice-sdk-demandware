'use strict';

var collections = require('*/cartridge/scripts/util/collections');

/**
 * @constructor
 * @classdesc Returns images for a given product
 * @param {dw.catalog.Product} product - product to return images for
 * @param {Object} imageConfig - configuration object with image types
 */
function Images(product, imageConfig) {
    imageConfig.types.forEach(function (type) {
        var images = product.getImages(type);
        var result = {};

        if (imageConfig.quantity === 'single') {
            var firstImage = collections.first(images);
            if (firstImage) {
                result = [{
                    alt: firstImage.alt,
                    url: firstImage.URL.toString(),
                    title: firstImage.title,
                    index: '0',
                    absURL: firstImage.absURL.toString()
                }];
            }
        } else {
            result = collections.map(images, function (image, index) {
                return {
                    alt: image.alt,
                    url: image.URL.toString(),
                    index: index.toString(),
                    title: image.title,
                    absURL: image.absURL.toString()
                };
            });
        }
        this[type] = result;
    }, this);
}

module.exports = Images;
