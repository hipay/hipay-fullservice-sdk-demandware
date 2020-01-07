'use strict';

module.exports = function (object, sizeChartId) {
    Object.defineProperty(object, 'sizeChartId', {
        enumerable: true,
        value: sizeChartId
    });
};
