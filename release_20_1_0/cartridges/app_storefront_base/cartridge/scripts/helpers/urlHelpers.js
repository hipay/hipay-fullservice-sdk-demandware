'use strict';

var QueryString = require('server').querystring;

/**
 * Appends query params to a URL
 *
 * @param {string} target - An URL endpoint with or without query params
 *     e.g. http://someresource or http://someresource?xyz=123
 * @param {Object|string[]} queryParamsToAppend - Object or list of query params strings with or
 *     without resource path prepended, where resource path is discarded
 *     e.g., ['xyz=123'] or ['http://someresource?xyz=123'] or { var1: val1, var2: val2 }
 * @return {string} - Target URL appended with query params from sourceQueryString
 */
function appendQueryParams(target, queryParamsToAppend) {
    var resource = target.split('?')[0];
    var targetQueryString = new QueryString(target);

    if (!Array.isArray(queryParamsToAppend) && typeof queryParamsToAppend === 'object') {
        Object.keys(queryParamsToAppend).forEach(function (key) {
            var value = queryParamsToAppend[key];
            if (!Object.prototype.hasOwnProperty.call(targetQueryString, key) && value) {
                targetQueryString[key] = queryParamsToAppend[key] || '';
            }
        });
    } else {
        targetQueryString = queryParamsToAppend.reduce(function (current, params) {
            var currentCopy = current;
            var queryToAppend = new QueryString(params);
            Object.keys(queryToAppend).forEach(function (key) {
                if (!Object.prototype.hasOwnProperty.call(currentCopy, key)) {
                    currentCopy[key] = queryToAppend[key] || '';
                }
            });
            return currentCopy;
        }, targetQueryString);
    }
    return resource + '?' + targetQueryString.toString();
}

module.exports = {
    QueryString: QueryString,
    appendQueryParams: appendQueryParams
};
