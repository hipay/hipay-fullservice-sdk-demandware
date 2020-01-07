'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'UUID', {
        enumerable: true,
        value: lineItem.UUID
    });
};
