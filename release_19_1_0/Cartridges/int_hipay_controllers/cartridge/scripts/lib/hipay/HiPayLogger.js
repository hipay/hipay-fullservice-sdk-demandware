/**
 * HiPayLogger class manages HiPay error and debug logging.
 */

var Logger = require('dw/system/Logger');

function HiPayLogger(scriptFileName) {
    this.scriptFileName = scriptFileName;
    this.log            = Logger.getLogger("HIPAY");
}

/* Logs error messages for a given script. */
HiPayLogger.prototype.error = function(errorMessage) {
    if (Logger.isErrorEnabled()) {
        Logger.error(this.scriptFileName + ' ' + errorMessage);
    }
}

/* Logs debug messages for a given script. */
HiPayLogger.prototype.debug = function(debugMessage) {
    if (this.log.isDebugEnabled()) {
        this.log.debug(this.scriptFileName + ' ' + debugMessage);
    }
}

/* Logs info messages for a given script. */
HiPayLogger.prototype.info = function(infoMessage) {
    if (this.log.isInfoEnabled()) {
        this.log.info(this.scriptFileName + ' ' + infoMessage);
    }
}

module.exports = HiPayLogger;
