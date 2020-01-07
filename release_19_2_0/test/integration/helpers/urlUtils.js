function urlUtils() {}

/**
 * Strips auth basic authentication parameters - if set - and returns the url
 *
 * @param {String} url - Url string
 * @returns {String}
 */
urlUtils.stripBasicAuth = function (url) {
    var splitUrl = url.split('storefront');
    if (splitUrl.length === 1) {
        return url;
    }
    var protocol = splitUrl[0];
    var host = splitUrl[1].split('@');
    return protocol + host[1];
};

module.exports = urlUtils;
