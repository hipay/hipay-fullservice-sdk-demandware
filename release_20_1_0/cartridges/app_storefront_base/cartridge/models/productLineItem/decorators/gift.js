'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'isGift', {
        enumerable: true,
        value: lineItem.gift
    });
};
