/**
 * Performs validation steps, based upon the entered billing information.
 */

function execute(args) {
    var HiPayLogger = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        log         = new HiPayLogger("HiPayValidateBilling");

    try {
        if (require('~/cartridge/scripts/lib/hipay/HiPayCheckoutModule').validateBilling()) {
            return PIPELET_NEXT;
        } else {
            return PIPELET_ERROR;
        }
    } catch (e) {
        log.error(e);
        return PIPELET_ERROR;
    }
}
