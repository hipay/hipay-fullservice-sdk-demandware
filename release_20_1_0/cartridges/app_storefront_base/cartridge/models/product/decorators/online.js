'use strict';

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'online', {
        enumerable: true,
        value: apiProduct ? !!apiProduct.online : false
    });
};

