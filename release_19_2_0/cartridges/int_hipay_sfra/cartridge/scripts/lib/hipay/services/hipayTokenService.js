/**
 * Initiates HiPay Token Generation request.
 */
function HiPayTokenService() {}

HiPayTokenService.prototype.generateToken = function (params) {
    var hipayServices = require('*/cartridge/scripts/init/hiPayServiceInit.js');
    var service = hipayServices.createToken();

    var content = '';
    // a key/value object here. 'for in' loop only is possible here
    for (var param in params) { // eslint-disable-line
        if (!empty(params[param])) {
            content += param + '=' + encodeURIComponent(params[param]) + '&';
        }
    }

    var response = service.call(content);

    return response;
};

module.exports = HiPayTokenService;
