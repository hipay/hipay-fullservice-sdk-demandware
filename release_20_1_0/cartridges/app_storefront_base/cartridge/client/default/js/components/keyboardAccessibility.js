'use strict';

module.exports = function (selector, keyFunctions, preFunction) {
    $(selector).on('keydown', function (e) {
        var key = e.which;
        var supportedKeyCodes = [37, 38, 39, 40, 27];
        if (supportedKeyCodes.indexOf(key) >= 0) {
            e.preventDefault();
        }
        var returnedScope = preFunction.call(this);
        if (keyFunctions[key]) {
            keyFunctions[key].call(this, returnedScope);
        }
    });
};
