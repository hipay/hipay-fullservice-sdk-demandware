'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'isBonusProductLineItem', {
        enumerable: true,
        value: lineItem.bonusProductLineItem
    });
};
