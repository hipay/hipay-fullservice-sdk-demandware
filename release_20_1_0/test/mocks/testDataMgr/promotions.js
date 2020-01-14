'use strict';

import _ from 'lodash';
import * as common from './common';

/**
 * Processes parsed JSONified file data and sends back map of Promotions
 *
 * @param {Object} rawPromotions - Raw JSONified Promotions demo data
 * @param {Object} processedPromotions - Processed-to-date parsedData.promotions
 * @param {String} file - File path of promotions.xml demo data file, used to extract Site name
 * @returns {Array} - Promotions
 */
export function parsePromotions(rawPromotions, processedPromotions, file) {
    const site = file.split('/sites/')[1].split('/')[0];
    let parsedPromotions = processedPromotions || {};

    parsedPromotions[site] = Object.hasOwnProperty.call(parsedPromotions, site) ? parsedPromotions[site] : {};
    parsedPromotions[site].campaigns = {};
    parsedPromotions[site].promotions = {};
    parsedPromotions[site].promotionCampaignAssignments = {};

    rawPromotions.promotions.campaign.forEach(campaign => {
        parsedPromotions[site].campaigns[campaign.$['campaign-id']] = campaign;
    });
    rawPromotions.promotions.promotion.forEach(promotion => {
        parsedPromotions[site].promotions[promotion.$['promotion-id']] = promotion;
    });
    rawPromotions.promotions['promotion-campaign-assignment'].forEach(assignment => {
        parsedPromotions[site].promotionCampaignAssignments[assignment.$['promotion-id']] = assignment;
    });

    return parsedPromotions;
}

/**
 * Returns a Promotion with the specified promotion-id
 *
 * @param {Object} promotions - parsedData.promotions.<Site Name>.promotions
 * @param {String} id - Promotion ID
 * @return {Promotion} - Promotion instance
 */
export function getPromotion(promotions, id) {
    return new Promotion(promotions[id]);
}

/**
 * Returns a Promotion with the specified promotion-id
 *
 * @param {Object} campaigns - parsedData.promotions.<Site Name>.campaigns
 * @param {String} id - Campaign ID
 * @return {Campaign} - Campaign instance
 */
export function getCampaign(campaigns, id) {
    return new Campaign(campaigns[id]);
}

/**
 * Returns a Promotion with the specified promotion-id
 *
 * @param {Object} assignments - parsedData.promotions.<Site Name>['promotion-campaign-assignment']
 * @param {String} promotionId - Campaign ID
 * @param {String} campaignId - Campaign ID
 * @return {PromotionCampaignAssignment} - Promotion-Campaign Assignment instance
 */
export function getPromotionCampaignAssignment(assignments, promotionId, campaignId) {
    const assignment = _.findWhere(assignments, { $: { 'promotion-id': promotionId, 'campaign-id': campaignId } });
    return new PromotionCampaignAssignment(assignment);
}

export class Campaign {
    constructor(campaign) {
        this.id = campaign.$['campaign-id'];
        this.description = campaign.description[0];
        this.isEnabled = campaign['enabled-flag'][0] === 'true';
        this.customerGroup = campaign['customer-groups'][0]['customer-group'][0].$['group-id'];
    }
}

export class PromotionCampaignAssignment {
    constructor(assignment) {
        this.promotionId = assignment.$['promotion-id'];
        this.campaignId = assignment.$['campaign-id'];
        this.qualifiers = {};

        if (Object.hasOwnProperty.call(assignment.qualifiers, 'match-mode')) {
            this.qualifiers.matchMode = assignment.qualifiers['match-mode'];
        }

        if (Object.hasOwnProperty.call(assignment, 'coupons')) {
            this.coupons = assignment.coupons.coupon.map(coupon => coupon.$['coupon-id']);
        }
    }
}

export class Promotion extends common.AbstractDwModelMock {
    constructor(promotion) {
        super(promotion);

        this.id = promotion.$['promotion-id'];
        this.isEnabled = promotion['enabled-flag'][0] === 'true';
        this.isSearchable = promotion['searchable-flag'][0] === 'true';
        this.exclusivity = promotion.exclusivity[0];
        this.name = common.parseLocalizedValues(promotion.name);
        this.calloutMsg = common.parseLocalizedValues(promotion['callout-msg']);

        if (Object.hasOwnProperty.call(promotion, 'details')) {
            this.details = common.parseLocalizedValues(promotion.details);
        }

        if (Object.hasOwnProperty.call(promotion, 'currency')) {
            this.currency = promotion.currency[0];
        }

        // Promotions have three different promotion rules of which only one can be applied: order, product, or shipping
        const ruleKeySuffix = '-promotion-rule';
        const promotionRuleKey = _.find(Object.keys(promotion), key => key.endsWith(ruleKeySuffix));
        const promotionRule = promotion[promotionRuleKey][0];

        this.promotionRuleType = promotionRuleKey.split(ruleKeySuffix)[0];

        if (Object.hasOwnProperty.call(promotionRule, 'discounts')) {
            this.discounts = processDiscounts(promotionRule);
        }

        if (Object.hasOwnProperty.call(promotionRule, 'qualifying-products')) {
            this.qualifyingProducts = {
                includedProducts: processIncludedProducts(promotionRule['qualifying-products'][0]['included-products'][0])
            };
        }

        if (Object.hasOwnProperty.call(promotionRule, 'excluded-products')) {
            this.excludedProducts = {
                includedProducts: processIncludedProducts(promotionRule['excluded-products'][0]['included-products'][0])
            };
        }

        if (Object.hasOwnProperty.call(promotionRule, 'discounted-products')) {
            this.discountedProducts = {
                includedProducts: processIncludedProducts(promotionRule['discounted-products'][0]['included-products'][0])
            };
        }

        if (Object.hasOwnProperty.call(promotionRule, 'enable-upsells')) {
            this.enableUpsells = promotionRule['enable-upsells'][0] === 'true';
        }

        if (Object.hasOwnProperty.call(promotionRule, 'upsell-threshold')) {
            this.upsellThreshold = promotionRule['upsell-threshold'][0];
        }

        if (Object.hasOwnProperty.call(promotionRule, 'discount-only-qualifying-products')) {
            this.discountOnlyQualifyingProducts = promotionRule['discount-only-qualifying-products'][0] === 'true';
        }

        if (Object.hasOwnProperty.call(promotionRule, 'payment-methods')) {
            this.paymentMethods = promotionRule['payment-methods'][0]['method-id'][0];
        }

        if (Object.hasOwnProperty.call(promotionRule, 'disable-global-excluded-products')) {
            this.disableGlobalExcludedProducts = promotionRule['disable-global-excluded-products'][0] === 'true';
        }

        if (Object.hasOwnProperty.call(promotionRule, 'max-applications')) {
            this.maxApplications = parseInt(promotionRule['max-applications'][0], 10);
        }

        if (Object.hasOwnProperty.call(promotionRule, 'identical-products')) {
            this.identicalProducts = promotionRule['identical-products'][0] === 'true';
        }

        if (Object.hasOwnProperty.call(promotionRule, 'bogo')) {
            this.bogo = processBogo(promotionRule.bogo[0]);
        }

        if (Object.hasOwnProperty.call(promotionRule, 'simple-discount')) {
            this.simpleDiscount = processSimpleDiscount(promotionRule['simple-discount'][0]);
        }

        if (Object.hasOwnProperty.call(promotionRule, 'total-discounts')) {
            this.totalDiscounts = processTotalDiscounts(promotionRule['total-discounts'][0]);
        }

        if (Object.hasOwnProperty.call(promotionRule, 'discounted-products-combination')) {
            this.discountedProductsCombination = processProductConstraint(promotionRule['discounted-products-combination'][0]['product-constraints'][0]);
        }
    }

    /**
     * Returns Promotion's localized Call Out Message
     *
     * @param {String} [locale] - xx_XX locale (i.e., it_IT, zh_CN, ja_JP)
     * @return {String} - Localized Promotion Call Out Message
     */
    getCalloutMsg(locale = 'x_default') {
        return this.getLocalizedProperty('calloutMsg', locale);
    }

    /**
     * Returns threshold at which discount takes effect
     *
     * @return {String} - Discount threshold value
     */
    getDiscountThreshold() {
        return Object.hasOwnProperty.call(this, 'discounts') ? this.discounts.threshold : undefined;
    }

    /**
     * Returns discount percentage to apply
     *
     * @return {String} - Discount percentage
     */
    getDiscountPercentage() {
        const hasDiscountsPercentage = Object.hasOwnProperty.call(this, 'discounts') &&
            Object.hasOwnProperty.call(this.discounts, 'discountType') &&
            this.discounts.discountType === 'percentage';

        if (Object.hasOwnProperty.call(this, 'simpleDiscount')) {
            return this.simpleDiscount.percentage[0];
        } else if (hasDiscountsPercentage) {
            return this.discounts.value;
        }
        return null;
    }
}

function processIncludedProducts(includedProductsRaw) {
    const includedConditionGroup = includedProductsRaw['condition-group'][0];
    let includedProducts = {};

    const processConditionType = {
        category: function (conditionGroup) {
            return {
                catalogId: conditionGroup.$['catalog-id'],
                categoryId: conditionGroup['category-id'][0]
            };
        },

        brand: function (conditionGroup) {
            return {
                operator: conditionGroup.$.operator,
                brand: conditionGroup.brand[0]
            };
        },

        price: function (conditionGroup) {
            return {
                operator: conditionGroup.$.operator,
                price: conditionGroup.price[0]
            };
        },

        'product-id': function (conditionGroup) {
            return {
                operator: conditionGroup.$.operator,
                productId: conditionGroup['product-id'][0]
            };
        },

        attribute: function (conditionGroup) {
            return {
                operator: conditionGroup.$.operator,
                attributeId: conditionGroup.$['attribute-id'],
                attributeValue: conditionGroup['attribute-value'][0]
            };
        }
    };

    Object.keys(includedConditionGroup).forEach(condition => {
        const conditionType = condition.replace('-condition', '');
        includedProducts[conditionType] = processConditionType[conditionType](includedConditionGroup[condition][0]);
    });

    return includedProducts;
}

function processDiscounts(promotionRule) {
    const discounts = promotionRule.discounts[0];
    const discount = discounts.discount[0];
    const discountType = _.remove(Object.keys(discount), key => key !== 'threshold')[0];
    let value;

    if (['percentage', 'amount'].indexOf(discountType) > -1) {
        value = discount[discountType][0];
    } else if (discountType === 'bonus-choice') {
        value = {
            bonusProducts: _.map(discount['bonus-choice'][0]['bonus-products'][0]['bonus-product'], bonusProduct => {
                return {
                    productId: bonusProduct.$['product-id'],
                    bonusProductPrice: bonusProduct['bonus-product-price'][0]
                };
            }),
            maxBonusItems: Object.hasOwnProperty.call(discount['bonus-choice'][0], 'max-bonus-items') ?
                parseInt(discount['bonus-choice'][0]['max-bonus-items'][0], 10) : null
        };
    }

    return {
        conditionType: discounts.$['condition-type'],
        threshold: discount.threshold[0],
        discountType: discountType,
        value: value
    };
}

function processBogo(rawBogo) {
    let bogo = {};

    bogo.threshold = rawBogo.threshold[0];
    bogo.eligibleQuantity = rawBogo['eligible-quantity'][0];

    if (Object.hasOwnProperty.call(rawBogo, 'fixed-price')) {
        bogo.fixedPrice = rawBogo['fixed-price'][0];
    }

    if (Object.hasOwnProperty.call(rawBogo, 'percentage')) {
        bogo.percentage = rawBogo.percentage[0];
    }

    if (Object.hasOwnProperty.call(rawBogo, 'free')) {
        bogo.free = rawBogo.free[0];
    }

    return bogo;
}

function processSimpleDiscount(simpleDiscountRaw) {
    let simpleDiscount = {};

    if (Object.hasOwnProperty.call(simpleDiscountRaw, 'percentage')) {
        simpleDiscount.percentage = simpleDiscountRaw.percentage;
    }

    if (Object.hasOwnProperty.call(simpleDiscountRaw, 'amount')) {
        simpleDiscount.amount = simpleDiscountRaw.amount;
    }

    if (Object.hasOwnProperty.call(simpleDiscountRaw, 'free-shipping')) {
        simpleDiscount.freeShipping = simpleDiscountRaw['free-shipping'];
    }

    return simpleDiscount;
}

function processTotalDiscounts(totalDiscountsRaw) {
    const discount = totalDiscountsRaw.discount[0];

    return {
        totalFixedPrice: discount['total-fixed-price'][0],
        eligibleQuantity: discount['eligible-quantity'][0]
    };
}

function processProductConstraint(productConstraints) {
    const productConstraint = productConstraints['product-constraint'][0];

    return {
        quantity: productConstraint.quantity[0],
        includedProducts: processIncludedProducts(productConstraint['product-specification'][0]['included-products'][0])
    };
}
