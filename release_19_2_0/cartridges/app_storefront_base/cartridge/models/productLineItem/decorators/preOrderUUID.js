'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'preOrderUUID', {
        enumerable: true,
        value: lineItem.custom.preOrderUUID
    });
};
