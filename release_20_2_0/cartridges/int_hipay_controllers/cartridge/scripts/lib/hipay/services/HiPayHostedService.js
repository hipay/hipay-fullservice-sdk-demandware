/**
 * Initiates HiPay hosted payment request.
 */
function HiPayHostedService() {}

HiPayHostedService.prototype.loadHostedPayment = function (params) {
    var hipayServices = require('*/cartridge/scripts/init/hiPayServiceInit.js');
    // Init service
    var service = hipayServices.hpayment();

    // Call API
    var response = service.call(params);

    return response;
};

module.exports = HiPayHostedService;
