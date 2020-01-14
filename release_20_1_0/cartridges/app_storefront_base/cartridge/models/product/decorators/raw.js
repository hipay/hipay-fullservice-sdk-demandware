'use strict';

/* we are only putting this in because there is no way to put this inside the ISObject */
module.exports = function (object, product) {
    Object.defineProperty(object, 'raw', {
        enumerable: false,
        value: product
    });
};
