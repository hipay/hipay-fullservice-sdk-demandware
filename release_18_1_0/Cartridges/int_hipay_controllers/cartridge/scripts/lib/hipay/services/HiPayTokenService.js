/**
* Initiates HiPay Token Generation request.
*/

var HTTPService     = require('dw/svc/HTTPService'),
    ServiceRegistry = require('dw/svc/ServiceRegistry'),
    Site            = require('dw/system/Site'),
    Logger          = require('dw/system/Logger');

function HiPayTokenService() {}

HiPayTokenService.prototype.generateToken = function(params) {
    var siteId = Site.getCurrent().getID(); /* get current ID of the site. */

    try { /* try create service for current site */
        var service = ServiceRegistry.get("hipay.rest.createtoken" + "." + siteId);
    } catch (e) {
        Logger.warn("Service {0}, doesn't exist", "hipay.rest.createtoken" + "." + siteId);
    }

    if (service == null) { /* get default service if service for current site  was not configured in BM */
        service = ServiceRegistry.get("hipay.rest.createtoken");
    }

    var content = "";

    for (var param in params) {
        if(empty(params[param])) {
            continue;
        }

        content +=  param + '=' + encodeURIComponent(params[param]) + '&';
    }

    var response = service.call(content);

    return response;
}

module.exports = HiPayTokenService;
