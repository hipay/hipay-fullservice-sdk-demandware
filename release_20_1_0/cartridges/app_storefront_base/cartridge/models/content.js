'use strict';

/**
 * Represents content model
 * @param  {dw.content.Content} contentValue - result of ContentMgr.getContent call
 * @param  {string} renderingTemplate - rendering template for the given content
 * @return {void}
 * @constructor
 */
function content(contentValue, renderingTemplate) {
    if (!contentValue.online) {
        return null;
    }

    var usedRenderingTemplate = renderingTemplate || 'components/content/contentAssetInc';

    this.body = (contentValue && contentValue.custom && contentValue.custom.body) || null;
    this.UUID = contentValue.UUID;
    this.ID = contentValue.ID;
    this.name = contentValue.name;
    this.template = contentValue.template || usedRenderingTemplate;
    this.pageTitle = contentValue.pageTitle;
    this.pageDescription = contentValue.pageDescription;
    this.pageKeywords = contentValue.pageKeywords;
    this.pageMetaTags = contentValue.pageMetaTags;

    return this;
}

module.exports = content;
