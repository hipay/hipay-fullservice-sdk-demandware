'use strict';

/**
 * fraud detection hook
 * @param {dw.order.Order} order - The order object to be placed
 * @returns {Object} an error object. Status can have three values 'success', 'fail' or 'flag'
 *         error code that could be mapped to localized resources error Message a string with the
 *         error message, that could be used as a fall-back if error code doesn't have a mapping
 */
function fraudDetection(order) { // eslint-disable-line
    var errorCode;
    var errorMessage;
    var status = 'success';

    return {
        status: status,
        errorCode: errorCode,
        errorMessage: errorMessage
    };
}

exports.fraudDetection = fraudDetection;
