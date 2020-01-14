'use strict';

module.exports = function (object, product, quantity) {
    Object.defineProperty(object, 'isOrderable', {
        enumerable: true,
        value: product.availabilityModel.isOrderable(quantity)
    });
};
