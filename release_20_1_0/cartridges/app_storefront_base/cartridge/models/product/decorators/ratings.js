'use strict';

module.exports = function (object) {
    Object.defineProperty(object, 'rating', {
        enumerable: true,
        value: (function () {
            var id = object.id;
            var sum = id.split('').reduce(function (total, letter) {
                return total + letter.charCodeAt(0);
            }, 0);

            var rateVal = (Math.ceil(((sum % 3) + 2) + (((sum % 10) / 10) + 0.1)));
            return (rateVal < 5 ? rateVal + (((sum % 10) * 0.1) + 0.1) : rateVal);
        }())
    });
};
