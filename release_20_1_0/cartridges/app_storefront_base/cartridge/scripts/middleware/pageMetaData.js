'use strict';

/**
 * Middleware to compute request pageMetaData object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function computedPageMetaData(req, res, next) {
    var computedMetaData = {
        title: req.pageMetaData.title,
        description: req.pageMetaData.description,
        keywords: req.pageMetaData.keywords,
        pageMetaTags: []
    };

    req.pageMetaData.pageMetaTags.forEach(function (item) {
        if (item.title) {
            computedMetaData.title = item.content;
        } else if (item.name && item.ID === 'description') {
            computedMetaData.description = item.content;
        } else if (item.name && item.ID === 'keywords') {
            computedMetaData.keywords = item.content;
        } else {
            computedMetaData.pageMetaTags.push(item);
        }
    });

    res.setViewData({
        CurrentPageMetaData: computedMetaData
    });
    next();
}

module.exports = {
    computedPageMetaData: computedPageMetaData
};
