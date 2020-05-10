/**
 * Initiates HiPay order request.
 */
function HiPayOrderService() {}

HiPayOrderService.prototype.loadOrderPayment = function (params) {
    var hipayServices = require('*/cartridge/scripts/init/hiPayServiceInit.js');

    // Init service
    var service = hipayServices.order();

    // Call API
    var response = service.call(params);

    return response;
};

module.exports = HiPayOrderService;
