'use strict';
var Resource = require('dw/web/Resource');


/**
 * default hook if no payment processor is supported
 * @return {Object} an object that contains error information
 */
function Handle() {
    var errors = [];
    errors.push(Resource.msg('error.payment.processor.not.supported', 'checkout', null));
    return { fieldErrors: [], serverErrors: errors, error: true };
}

/**
 * default hook if no payment processor is supported
 * @return {Object} an object that contains error information
 */
function Authorize() {
    var errors = [];
    errors.push(Resource.msg('error.payment.processor.not.supported', 'checkout', null));
    return { fieldErrors: [], serverErrors: errors, error: true };
}

exports.Handle = Handle;
exports.Authorize = Authorize;
