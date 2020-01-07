/* globals session */
'use strict';

var PromotionMgr = require('dw/campaign/PromotionMgr');
var collections = require('*/cartridge/scripts/util/collections');

var promotionCache = Object.create(null);

Object.defineProperty(promotionCache, 'promotions', {
    get: function () {
        if (session.privacy.promoCache) {
            return JSON.parse(session.privacy.promoCache);
        }
        var activePromotions = PromotionMgr.activeCustomerPromotions.getProductPromotions();
        var promoIds = collections.map(activePromotions, function (promo) {
            return promo.ID;
        });

        session.privacy.promoCache = JSON.stringify(promoIds);
        return promoIds;
    }
});

module.exports = promotionCache;
