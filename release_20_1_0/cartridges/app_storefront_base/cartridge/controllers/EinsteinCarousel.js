'use strict';

var server = require('server');
var Template = require('dw/util/Template');
var ProductMgr = require('dw/catalog/ProductMgr');
var HashMap = require('dw/util/HashMap');

server.get('Load', function (req) {
    var newFactory = require('*/cartridge/scripts/factories/product');
    var URLUtils = require('dw/web/URLUtils');
    var components = (JSON.parse(req.querystring.components));
    var limit = parseInt(req.querystring.limit, 10);
    var successfulrenderings = 0;
    components.forEach(function (component) {
        if (limit <= successfulrenderings) {
            return;
        }
        var model = new HashMap();
        model.index = successfulrenderings;

        if (component.model.type === 'product') {
            var product = ProductMgr.getProduct(component.model.id);
            if (!product || !product.online) {
                return;
            }

            model.product = newFactory.get({ pid: component.model.id, pview: 'tile' });
            model.urls = {
                product: URLUtils.url('Product-Show', 'pid', component.model.id).relative().toString()
            };
            model.display = {
                swatches: component.swatches,
                ratings: component.displayratings,
                xs: component.classxs,
                sm: component.classsm,
                md: component.classmd
            };

            if (successfulrenderings === 0) {
                model.additionalClass = 'active';
            }
        }

        var template = new Template('experience/components/' + component.template);
        var renderedTemplate = template.render(model);
        response.writer.print(renderedTemplate.text); // eslint-disable-line no-undef
        successfulrenderings++;
    });
});

module.exports = server.exports();
