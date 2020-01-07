'use strict';

module.exports = function (object, quantity) {
    Object.defineProperty(object, 'quantity', {
        enumerable: true,
        value: quantity
    });
};
