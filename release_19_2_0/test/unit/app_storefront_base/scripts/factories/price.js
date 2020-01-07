'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');
var mockCollections = require('../../../../mocks/util/collections');


describe('priceFactory', function () {
    var price;
    var product;

    var spyDefaultPrice = sinon.spy();
    var spyTieredPrice = sinon.spy();
    var stubRangePrice = sinon.stub();
    var stubGetPromotionPrice = sinon.stub();
    var stubGetProductPromotions = sinon.stub();
    stubGetProductPromotions.returns([]);

    var PROMOTION_CLASS_PRODUCT = 'awesome promotion';

    var priceFactory = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/factories/price.js', {
        '*/cartridge/scripts/util/collections': {
            find: mockCollections.find
        },
        '*/cartridge/scripts/helpers/pricing': {
            getRootPriceBook: function () { return { ID: '123' }; },
            getPromotionPrice: stubGetPromotionPrice
        },
        'dw/campaign/PromotionMgr': {
            activeCustomerPromotions: {
                getProductPromotions: stubGetProductPromotions
            }
        },
        '*/cartridge/models/price/default': spyDefaultPrice,
        '*/cartridge/models/price/range': stubRangePrice,
        '*/cartridge/models/price/tiered': spyTieredPrice,
        'dw/campaign/Promotion': {
            PROMOTION_CLASS_PRODUCT: PROMOTION_CLASS_PRODUCT
        },
        'dw/value/Money': { NOT_AVAILABLE: null }
    });

    describe('Tiered Price', function () {
        var priceTable;

        afterEach(function () {
            spyTieredPrice.reset();
        });

        it('should produce a tiered price if price tables have more than 1 quantity', function () {
            priceTable = { quantities: { length: 3 } };
            product = {
                getPriceModel: function () {
                    return {
                        getPriceTable: function () { return priceTable; }
                    };
                }
            };
            price = priceFactory.getPrice(product);
            assert.isTrue(spyTieredPrice.calledWithNew());
        });

        it('should not produce a tiered price if a price table has only 1 quantity', function () {
            priceTable = { quantities: { length: 1 } };
            product = {
                master: false,
                priceModel: {
                    priceRange: false,
                    price: {
                        valueOrNull: null
                    },
                    minPrice: '$5',
                    getPriceTable: function () {
                        return priceTable;
                    }
                },
                getPriceModel: function () {
                    return this.priceModel;
                },
                variationModel: {
                    variants: [{}, {}]
                }
            };
            price = priceFactory.getPrice(product);
            assert.isFalse(spyTieredPrice.calledWithNew());
        });
    });

    describe('Range Price', function () {
        var rangePrice = {
            min: {
                sales: { value: '$5' }
            },
            max: {
                sales: { value: '$15' }
            }
        };
        beforeEach(function () {
            product = {
                master: true,
                priceModel: {
                    price: { valueOrNull: 'value' },
                    priceInfo: { priceBook: {} },
                    priceRange: true,
                    getPriceTable: function () {
                        return {
                            quantities: { length: 1 }
                        };
                    },
                    getPriceBookPrice: function () {
                        return { available: true };
                    }
                },
                getPriceModel: function () {
                    return this.priceModel;
                },
                variationModel: {
                    variants: [{}, {}]
                }
            };
        });

        afterEach(function () {
            stubRangePrice.reset();
        });

        it('should produce a range price', function () {
            stubRangePrice.returns(rangePrice);
            price = priceFactory.getPrice(product);
            assert.equal(price, rangePrice);
        });

        it('should not produce a range price if min and max values are equal', function () {
            rangePrice = {
                min: {
                    sales: { value: '$5' }
                },
                max: {
                    sales: { value: '$5' }
                }
            };
            stubRangePrice.returns(rangePrice);
            product.variationModel = { variants: [] };

            price = priceFactory.getPrice(product);
            assert.notEqual(price, rangePrice);
        });
    });

    describe('Default Price', function () {
        var priceModel = {};
        var secondSpyArg;
        var variantPriceModel = {};

        afterEach(function () {
            spyDefaultPrice.reset();
        });

        it('should use the first variant if product is a master', function () {
            var expectedPrice = { available: true };
            priceModel = {
                price: { valueOrNull: 'value' },
                priceInfo: { priceBook: {} },
                priceRange: false,
                getPriceTable: function () {
                    return {
                        quantities: { length: 1 }
                    };
                },
                getPriceBookPrice: function () { return expectedPrice; }
            };
            variantPriceModel = {
                price: { valueOrNull: null },
                priceInfo: { priceBook: {} },
                priceRange: false,
                minPrice: '$8',
                getPriceTable: function () {
                    return {
                        quantities: { length: 1 }
                    };
                },
                getPriceBookPrice: function () { return expectedPrice; }
            };
            product = {
                master: true,
                priceModel: priceModel,
                getPriceModel: function () { return priceModel; },
                variationModel: {
                    variants: [{ priceModel: variantPriceModel }, {}]
                }
            };
            price = priceFactory.getPrice(product);
            assert.isTrue(spyDefaultPrice.calledWith(variantPriceModel.price));
        });

        it('should assign list price to root pricebook price when available', function () {
            var pricebookListPrice = {
                available: true,
                value: '$20',
                valueOrNull: 20
            };
            product = {
                master: false,
                priceModel: {
                    price: { valueOrNull: 'value' },
                    priceInfo: { priceBook: {} },
                    priceRange: false,
                    getPriceTable: function () {
                        return {
                            quantities: { length: 1 }
                        };
                    },
                    getPriceBookPrice: function () { return pricebookListPrice; }
                },
                getPriceModel: function () { return this.priceModel; },
                variationModel: {
                    variants: [{}, {}]
                }
            };
            price = priceFactory.getPrice(product);
            secondSpyArg = spyDefaultPrice.args[0][1];
            assert.isTrue(spyDefaultPrice.calledWithNew());
            assert.equal(secondSpyArg, pricebookListPrice);
        });

        it('should instantiate DefaultPrice with only sales price when equal to list price', function () {
            var expectedPrice = { available: false };
            product = {
                master: false,
                priceModel: {
                    price: {
                        available: true,
                        valueOrNull: 'value',
                        value: '$28'
                    },
                    priceInfo: { priceBook: {} },
                    priceRange: false,
                    minPrice: {
                        value: '$2'
                    },
                    getPriceTable: function () {
                        return {
                            quantities: { length: 1 }
                        };
                    },
                    getPriceBookPrice: function () { return expectedPrice; }
                },
                getPriceModel: function () { return this.priceModel; }
            };
            price = priceFactory.getPrice(product);
            assert.isTrue(spyDefaultPrice.calledWith(product.priceModel.price, null));
        });

        it('should assign list price to priceModel minPrice when root pricebook and priceModel price not available', function () {
            var expectedPrice = { available: false };
            product = {
                master: false,
                priceModel: {
                    price: {
                        available: false,
                        valueOrNull: 'value',
                        value: '$28'
                    },
                    priceInfo: { priceBook: {} },
                    priceRange: false,
                    minPrice: {
                        value: '$2'
                    },
                    getPriceTable: function () {
                        return {
                            quantities: { length: 1 }
                        };
                    },
                    getPriceBookPrice: function () { return expectedPrice; }
                },
                getPriceModel: function () { return this.priceModel; }
            };
            price = priceFactory.getPrice(product);
            secondSpyArg = spyDefaultPrice.args[0][1];
            assert.isTrue(spyDefaultPrice.calledWithNew());
            assert.equal(secondSpyArg, product.priceModel.minPrice);
        });

        describe('with promotional prices', function () {
            var listPrice = {
                available: true,
                value: 50,
                valueOrNull: 50
            };
            var salesPrice = {
                value: 30,
                valueOrNull: 'value',
                compareTo: function (otherPrice) {
                    return this.value > otherPrice.value;
                }
            };
            var promotionalPrice = {
                available: true,
                value: 10,
                valueOrNull: 10
            };
            var promotions = [{
                promotionClass: {
                    equals: function () { return true; }
                },
                getPromotionalPrice: function () {
                    return promotionalPrice;
                }
            }];

            beforeEach(function () {
                stubGetProductPromotions.returns(promotions);
                stubGetPromotionPrice.returns({
                    available: true,
                    value: 10,
                    valueOrNull: 10
                });
            });

            afterEach(function () {
                spyDefaultPrice.reset();
            });

            it('should swap sales price for promo price', function () {
                product = {
                    master: false,
                    priceModel: {
                        price: salesPrice,
                        priceInfo: { priceBook: {} },
                        getPriceTable: function () {
                            return {
                                quantities: { length: 1 }
                            };
                        },
                        getPriceBookPrice: function () { return listPrice; }
                    },
                    getPriceModel: function () { return this.priceModel; }
                };
                price = priceFactory.getPrice(product, null, null, promotions);
                assert.isTrue(spyDefaultPrice.calledWithNew());
                assert.isTrue(spyDefaultPrice.calledWith(promotionalPrice, listPrice));
            });

            it('should get a promotional price when an option product is provided', function () {
                product = {
                    master: false,
                    priceModel: {
                        price: salesPrice,
                        priceInfo: { priceBook: {} },
                        getPriceTable: function () {
                            return {
                                quantities: { length: 1 }
                            };
                        },
                        getPriceBookPrice: function () { return listPrice; }
                    },
                    getPriceModel: function () { return this.priceModel; }
                };
                price = priceFactory.getPrice(product, null, null, promotions, true);
                assert.isTrue(spyDefaultPrice.calledWithNew());
                assert.isTrue(spyDefaultPrice.calledWith(promotionalPrice, listPrice));
            });

            it('should get a promotional price when an option product is not provided', function () {
                product = {
                    master: false,
                    priceModel: {
                        price: salesPrice,
                        priceInfo: { priceBook: {} },
                        getPriceTable: function () {
                            return {
                                quantities: { length: 1 }
                            };
                        },
                        getPriceBookPrice: function () { return listPrice; }
                    },
                    getPriceModel: function () { return this.priceModel; },
                    optionModel: { option: 'model' }
                };
                price = priceFactory.getPrice(product, null, null, promotions, false);
                assert.isTrue(spyDefaultPrice.calledWithNew());
                assert.isTrue(spyDefaultPrice.calledWith(promotionalPrice, listPrice));
            });

            it('should set sales price to list price if sales price is null', function () {
                product = {
                    master: false,
                    priceModel: {
                        price: {
                            value: null,
                            valueOrNull: null,
                            compareTo: function (otherPrice) {
                                return this.value > otherPrice.value;
                            }
                        },
                        priceInfo: { priceBook: {} },
                        getPriceTable: function () {
                            return {
                                quantities: { length: 1 }
                            };
                        },
                        getPriceBookPrice: function () { return listPrice; }
                    },
                    getPriceModel: function () { return this.priceModel; },
                    optionModel: { option: 'model' }
                };
                price = priceFactory.getPrice(product, null, null, promotions, false);
                assert.isTrue(spyDefaultPrice.calledWithNew());
                assert.isTrue(spyDefaultPrice.calledWith(listPrice, {}));
            });
        });
    });
});
