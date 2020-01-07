'use strict';

var VariationAttributesModel = require('*/cartridge/models/product/productAttributes');

module.exports = function (object, variationModel, config) {
    Object.defineProperty(object, 'variationAttributes', {
        enumerable: true,
        value: variationModel
            ? (new VariationAttributesModel(
                variationModel,
                config,
                config.selectedOptionsQueryParams,
                object.selectedQuantity)).slice(0)
            : null
    });
};
