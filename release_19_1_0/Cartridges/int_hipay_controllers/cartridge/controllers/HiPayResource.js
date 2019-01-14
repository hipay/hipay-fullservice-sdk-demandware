'use strict';

/**
* HiPayResource.js
*
* @module  controllers/HiPayResource
*/

/* API includes */
var ISML  = require('dw/template/ISML'),
    guard = require('~/cartridge/scripts/guard');

/* Load merchant CSS style for HiPay*/
function style() {
    ISML.renderTemplate('hipay/hosted/hipaycss');
}

/** @see {@link module:controllers/HiPayResource~style} */
exports.Style = guard.ensure(['https'], style);
