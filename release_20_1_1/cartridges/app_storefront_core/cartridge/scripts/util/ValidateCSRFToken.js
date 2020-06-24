'use strict';

var CSRFProtection = require('dw/web/CSRFProtection');

// eslint-disable-next-line no-unused-vars
function execute() {
    if (!CSRFProtection.validateRequest()) {
        return PIPELET_ERROR;
    }

    return PIPELET_NEXT;
}
