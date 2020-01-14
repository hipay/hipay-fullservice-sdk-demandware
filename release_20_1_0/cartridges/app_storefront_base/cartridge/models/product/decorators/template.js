'use strict';

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'template', {
        enumerable: true,
        value: apiProduct.template
    });
};
