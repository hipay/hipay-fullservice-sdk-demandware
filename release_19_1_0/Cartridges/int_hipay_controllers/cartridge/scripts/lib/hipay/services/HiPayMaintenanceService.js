var HTTPService     = require('dw/svc/HTTPService'),
    ServiceRegistry = require('dw/svc/ServiceRegistry'),
    Site            = require('dw/system/Site'),
    Logger          = require('dw/system/Logger');

/* HiPayMaintenanceService.ds object initiates HiPay maintenance request.*/
function HiPayMaintenanceService() {}

HiPayMaintenanceService.OPERATION_CAPTURE = "capture";

/* Initiates HiPay hosted payment request.*/
HiPayMaintenanceService.prototype.initiateCapture = function(transactionReference, operation, amount) {
    var siteId = Site.getCurrent().getID(); /* get current ID of the site. */

    try { /* try create service for current site */
        var service = ServiceRegistry.get("hipay.rest.maintenance"+"."+siteId);
    } catch (e) {
        Logger.warn("Service {0}, doesn't exist", "hipay.rest.maintenance"+"."+siteId);
    }

    if (service == null) { /* get default service if service for current site  was not configured in BM */
        service = ServiceRegistry.get("hipay.rest.maintenance");
    }

    service.URL += transactionReference;

    var content = "operation=" + operation;

    if (!empty(amount)) {
        content+= "&amount=" + amount;
    }

    var response = service.call(content);

    return response;
}

module.exports = HiPayMaintenanceService;
