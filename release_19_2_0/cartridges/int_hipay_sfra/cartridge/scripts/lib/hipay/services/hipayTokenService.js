/**
 * Initiates HiPay Token Generation request.
 */
function HiPayTokenService() {}

HiPayTokenService.prototype.generateToken = function (params) {
    var hipayServices = require('*/cartridge/scripts/init/hiPayServiceInit.js');
    // Init service
    var service = hipayServices.createToken();

    // Call API
    var response = service.call(params);

    return response;
};

module.exports = HiPayTokenService;
