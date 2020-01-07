'use strict';

module.exports = function (object) {
    Object.defineProperty(object, 'readyToOrder', {
        enumerable: true,
        value: (function () {
            return !object.bundledProducts.some(function (product) {
                return !(product.available && product.readyToOrder);
            });
        }())
    });
};
