/**
 * Initiates HiPay order request.
 */
function HiPayOrderService() {}

HiPayOrderService.prototype.loadOrderPayment = function (params) {
    var hipayServices = require('*/cartridge/scripts/init/hiPayServiceInit.js');
    var service = hipayServices.order();

    var content = '';
    for (var param in params) { // eslint-disable-line no-restricted-syntax
        if (!empty(params[param])) {
            content += param + '=' + encodeURIComponent(params[param]) + '&';
        }
    }

    var response = service.call(content);

    return response;
};

module.exports = HiPayOrderService;
