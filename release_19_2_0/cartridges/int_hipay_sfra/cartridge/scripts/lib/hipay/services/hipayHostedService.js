/**
 * Initiates HiPay hosted payment request.
 */
function HiPayHostedService() {}

HiPayHostedService.prototype.loadHostedPayment = function (params) {
    var hipayServices = require('*/cartridge/scripts/init/hiPayServiceInit.js');
    var service = hipayServices.hpayment();

    var content = '';
    for (var param in params) { // eslint-disable-line
        if (!empty(params[param])) {
            content += param + '=' + encodeURIComponent(params[param]) + '&';
        }
    }

    var response = service.call(content);

    return response;
};

module.exports = HiPayHostedService;
