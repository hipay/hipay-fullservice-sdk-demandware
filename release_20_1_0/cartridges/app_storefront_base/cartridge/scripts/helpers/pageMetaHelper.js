'use strict';

/**
 * Set page meta Data including page title, page description and page keywords
 *
 * @param {Object} pageMetaData - Global request pageMetaData object
 * @param {Object} object - object which contains page meta data for instance product/content
 */
function setPageMetaData(pageMetaData, object) {
    var title = '';

    if (object === null) {
        return;
    }

    if ('pageTitle' in object) {
        title = object.pageTitle;
    }

    if (!title && 'name' in object) {
        title = object.name;
    } else if (!title && 'productName' in object) {
        title = object.productName;
    }

    pageMetaData.setTitle(title);

    if ('pageDescription' in object && object.pageDescription) {
        pageMetaData.setDescription(object.pageDescription);
    }

    if ('pageKeywords' in object && object.pageKeywords) {
        pageMetaData.setKeywords(object.pageKeywords);
    }
}

/**
 * Set page meta tags to support rule based meta data
 *
 * @param {Object} pageMetaData - Global request pageMetaData object
 * @param {Object} object - object which contains page meta tags
 */
function setPageMetaTags(pageMetaData, object) {
    if (object === null) {
        return;
    }

    if ('pageMetaTags' in object) {
        pageMetaData.addPageMetaTags(object.pageMetaTags);
    }
}

module.exports = {
    setPageMetaData: setPageMetaData,
    setPageMetaTags: setPageMetaTags
};
