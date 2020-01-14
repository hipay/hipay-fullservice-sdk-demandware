'use strict';

var URLUtils = require('dw/web/URLUtils');

var styles = [];
var scripts = [];

module.exports = {
    addCss: function (src) {
        if (/((http(s)?:)?\/\/).*.css/.test(src)) {
            if (styles.lastIndexOf(src) < 0) {
                styles.push(src);
            }
        } else if (styles.lastIndexOf(URLUtils.staticURL(src).toString()) < 0) {
            styles.push(URLUtils.staticURL(src).toString());
        }
    },
    addJs: function (src) {
        if (/((http(s)?:)?\/\/).*.js/.test(src)) {
            if (scripts.lastIndexOf(src) < 0) {
                scripts.push(src);
            }
        } else if (scripts.lastIndexOf(URLUtils.staticURL(src).toString()) < 0) {
            scripts.push(URLUtils.staticURL(src).toString());
        }
    },
    scripts: scripts,
    styles: styles
};
