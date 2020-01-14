'use strict';

module.exports = function (object, options) {
    Object.defineProperty(object, 'options', {
        enumerable: true,
        value: options
    });
};
