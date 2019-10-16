/**
 * Removes the existing payment instruments, if any,
 * and applies only the selected one for case if HiPay enabled.
 */

function execute(args) {
    var HiPayLogger = require("*/cartridge/scripts/lib/hipay/HiPayLogger"),
        log = new HiPayLogger("HiPayResetPaymentForms");

    try {
        if (require('*/cartridge/scripts/lib/hipay/HiPayCheckoutModule').resetPaymentForms()) {
            return PIPELET_NEXT;
        } else {
            return PIPELET_ERROR;
        }
    } catch (e) {
        log.error(e);
        return PIPELET_ERROR;
    }
}
