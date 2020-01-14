'use strict';

var ImageModel = require('*/cartridge/models/product/productImages');

module.exports = function (object, product, config) {
    Object.defineProperty(object, 'images', {
        enumerable: true,
        value: new ImageModel(product, config)
    });
};
