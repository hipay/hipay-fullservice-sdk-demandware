'use strict';

module.exports = function (object) {
    Object.defineProperty(object, 'readyToOrder', {
        enumerable: true,
        value: (function () {
            return object.individualProducts.every(function (product) {
                return product.readyToOrder;
            });
        }())
    });
};
