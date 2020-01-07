'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var Categories = require('*/cartridge/models/categories');
var ArrayList = require('dw/util/ArrayList');

/**
 * Render logic for the storefront.category component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
    var content = context.content;
    model.textHeadline = content.textHeadline;
    var categoriesToBeDisplayed = new ArrayList();
    var customCategoryNames = new HashMap();

    for (var i = 1; i <= 12; i++) {
        var cat = content['category' + i];

        if (cat) {
            categoriesToBeDisplayed.push(cat);

            if (content['customCategoryName' + i]) {
                customCategoryNames[cat.ID] = content['customCategoryName' + i];
            }
        }
    }

    var categories = new Categories(categoriesToBeDisplayed);
    model.categories = categories.categories;
    model.customCategoryNames = customCategoryNames;

    if (content.image) {
        model.image = {
            url: content.image.file.url,
            focalPointX: (content.image.focalPoint.x * 100) + '%',
            focalPointY: (content.image.focalPoint.y * 100) + '%'
        };
        model.applyImageShade = content.applyImageShade;
        model.changeTextColor = content.changeTextColor;
    }

    return new Template('experience/components/commerce_assets/category').render(model).text;
};
