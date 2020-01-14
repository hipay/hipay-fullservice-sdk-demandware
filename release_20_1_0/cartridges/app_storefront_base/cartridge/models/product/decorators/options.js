'use strict';

var productHelper = require('*/cartridge/scripts/helpers/productHelpers');

module.exports = function (object, optionModel, variables, quantity) {
    Object.defineProperty(object, 'options', {
        enumerable: true,
        value: productHelper.getOptions(optionModel, { variables: variables, quantity: quantity })
    });
};
