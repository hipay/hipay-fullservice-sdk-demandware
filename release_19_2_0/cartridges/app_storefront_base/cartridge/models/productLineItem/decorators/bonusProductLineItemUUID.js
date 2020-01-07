'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'bonusProductLineItemUUID', {
        enumerable: true,
        value: lineItem.custom.bonusProductLineItemUUID
    });
};
