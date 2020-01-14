/**
 * stepCleanSaveOneclick step-job module
 *
 * @module cartridge/controllers/jobs/stepCleanSaveOneclick
 */

'use strict';

/* Script Modules */
var Logger = require('dw/system/Logger').getLogger('Hipay-stepCleanSaveOneclick');
var Status = require('dw/system/Status');

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Constants = require('~/cartridge/scripts/util/Constants');

/**
 * Script is used in a step-job to delete attempts that are more than 24 hours old
 */
function stepCleanSaveOneclick() {
    Logger.info('step-job stepCleanSaveOneclick : start of treatment');
    try {  
        var listAttempts;  
        var deletedNumber = 0;
        var failedNumber = 0;
        var lastDay = new Date();
        lastDay.setDate(lastDay.getDate() - 1);
       
        listAttempts = CustomObjectMgr.queryCustomObjects(Constants.OBJ_SAVE_ONE_CLICK, "custom.attemptDate < {0}","custom.attemptDate desc", lastDay);
      
        if (listAttempts && listAttempts.getCount() > 0){
            Logger.info('\n[The number of attempts that are more than 24 hours old : {0} ]', listAttempts.getCount() );   
            while (listAttempts.hasNext()) {
                var currentAttemptObj = listAttempts.next();                  
                if (currentAttemptObj) {
                    CustomObjectMgr.remove(currentAttemptObj);
                    deletedNumber++;
                }              
            }

            if (deletedNumber > 0) {
                Logger.info('\n[The number of attempts that have been deleted : {0} ]', deletedNumber );
            }

            failedNumber = listAttempts.getCount() - deletedNumber;
            if (failedNumber > 0) {
                Logger.warn('\n### The number of attempts that have failed to remove : {0} ###', failedNumber);
            }
        } else {
            Logger.info('\n###### NO attempts found that have more than 24 hours ######'); 
        }    
    } catch (e) {
        Logger.error('[stepCleanSaveOneclick.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
        return new Status(Status.ERROR);
    }  

    Logger.info('step-job stepCleanSaveOneclick : end with OK');
    return new Status(Status.OK);
}

/* Exports of the modules */
/**
 * @see {@link modulecartridge/controllers/jobs/stepCleanSaveOneclick~StepCleanSaveOneclick} */
 exports.StepCleanSaveOneclick = stepCleanSaveOneclick;
