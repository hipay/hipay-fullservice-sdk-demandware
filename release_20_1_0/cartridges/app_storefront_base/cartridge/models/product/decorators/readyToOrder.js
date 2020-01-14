'use strict';

module.exports = function (object, variationModel) {
    Object.defineProperty(object, 'readyToOrder', {
        enumerable: true,
        value: variationModel ? !!variationModel.selectedVariant : true
    });
};
