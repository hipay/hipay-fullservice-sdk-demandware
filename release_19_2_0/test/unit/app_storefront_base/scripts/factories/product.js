'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../mocks/dw.util.Collection');
var sinon = require('sinon');

var stubFullProduct = sinon.stub();
stubFullProduct.returns('full product');

var stubProductSet = sinon.stub();
stubProductSet.returns('product set');

var stubProductBundle = sinon.stub();
stubProductBundle.returns('product bundle');

var stubProductTile = sinon.stub();
stubProductTile.returns('product tile');

var stubProductLineItem = sinon.stub();
stubProductLineItem.returns('product line item');

var stubOrderLineItem = sinon.stub();
stubOrderLineItem.returns('product line item (order)');

var stubBundleLineItem = sinon.stub();
stubBundleLineItem.returns('bundle line item');

var stubBundleOrderLineItem = sinon.stub();
stubBundleOrderLineItem.returns('bundle line item (order)');

var stubBonusProduct = sinon.stub();
stubBonusProduct.returns('bonus product');

var stubBonusProductLineItem = sinon.stub();
stubBonusProductLineItem.returns('bonus product line item');

var stubBonusOrderLineItem = sinon.stub();
stubBonusOrderLineItem.returns('bonus product line item (order)');

var productMock = {};
var options = {};

var optionProductLineItems = new ArrayList([]);

describe('Product Factory', function () {
    var collections = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var productFactory = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/factories/product', {
        '*/cartridge/scripts/util/collections': collections,
        'dw/catalog/ProductMgr': {
            getProduct: function () {
                return productMock;
            }
        },
        'dw/campaign/PromotionMgr': {
            activeCustomerPromotions: {
                getProductPromotions: function () { return 'promotions'; }
            }
        },
        '*/cartridge/scripts/helpers/productHelpers': {
            getCurrentOptionModel: function () { return 'optionModel'; },
            getProductType: function (product) {
                var result;
                if (product.master) {
                    result = 'master';
                } else if (product.variant) {
                    result = 'variant';
                } else if (product.variationGroup) {
                    result = 'variationGroup';
                } else if (product.productSet) {
                    result = 'set';
                } else if (product.bundle) {
                    result = 'bundle';
                } else if (product.optionProduct) {
                    result = 'optionProduct';
                } else {
                    result = 'standard';
                }
                return result;
            },
            getConfig: function () {
                return options;
            },
            getVariationModel: function () {
                return productMock.variationModel;
            },
            getLineItemOptions: function () {
                return [{ productId: 'someID', optionId: 'someOptionId', selectedValueId: 'someValueId' }];
            },
            getDefaultOptions: function () {
                return ['name:value'];
            },
            getLineItemOptionNames: function () {
                return ['lineItemOptionNames'];
            }
        },
        '*/cartridge/models/product/productTile': stubProductTile,
        '*/cartridge/models/product/fullProduct': stubFullProduct,
        '*/cartridge/models/product/productSet': stubProductSet,
        '*/cartridge/models/product/productBundle': stubProductBundle,
        '*/cartridge/models/productLineItem/productLineItem': stubProductLineItem,
        '*/cartridge/models/productLineItem/orderLineItem': stubOrderLineItem,
        '*/cartridge/models/productLineItem/bundleLineItem': stubBundleLineItem,
        '*/cartridge/models/productLineItem/bundleOrderLineItem': stubBundleOrderLineItem,
        '*/cartridge/models/product/bonusProduct': stubBonusProduct,
        '*/cartridge/models/productLineItem/bonusProductLineItem': stubBonusProductLineItem,
        '*/cartridge/models/productLineItem/bonusOrderLineItem': stubBonusOrderLineItem
    });

    beforeEach(function () {
        productMock = {
            optionModel: {
                options: new ArrayList([])
            },
            variationModel: {
                master: false,
                selectedVariant: false,
                productVariationAttributes: new ArrayList([{
                    color: {
                        ID: 'someID',
                        value: 'blue'
                    }
                }]),
                getAllValues: function () {
                    return new ArrayList([{
                        value: 'someValue'
                    }]);
                },
                setSelectedAttributeValue: function () {},
                getSelectedVariant: function () {}
            },
            master: false,
            variant: false,
            variationGroup: false,
            productSet: false,
            bundle: false,
            optionProduct: false
        };
    });

    it('should return full product model for product type master', function () {
        var params = {
            pid: 'someID'
        };
        productMock.master = true;
        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'master'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return full product model for product type variant', function () {
        var params = {
            pid: 'someID'
        };
        productMock.variant = true;

        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'variant'
        };
        var result = productFactory.get(params);

        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return full product model for product type variationGroup', function () {
        var params = {
            pid: 'someID'
        };
        productMock.variationGroup = true;
        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'variationGroup'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return full product model for product type optionProduct', function () {
        var params = {
            pid: 'someID'
        };
        productMock.optionProduct = true;
        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'optionProduct'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return full product model for product type standard', function () {
        var params = {
            pid: 'someID'
        };
        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'standard'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return set product model for product type productSet', function () {
        var params = {
            pid: 'someID'
        };
        productMock.productSet = true;
        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'set'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'product set');
        assert.isTrue(stubProductSet.calledWith({}, options.apiProduct, options, productFactory));
    });

    it('should return bundle product model for product type bundle', function () {
        var params = {
            pid: 'someID'
        };
        productMock.bundle = true;
        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'bundle'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'product bundle');
        assert.isTrue(stubProductBundle.calledWith({}, options.apiProduct, options, productFactory));
    });

    it('should return full product model for product type master with variables and variation model type master', function () {
        var params = {
            pid: 'someID',
            variables: {
                color: {
                    value: 'blue'
                }
            }
        };
        productMock.master = true;
        productMock.variationModel.master = true;
        productMock.variationModel.productVariationAttributes = new ArrayList([{ ID: 'color' }]);
        productMock.variationModel.getAllValues = function () {
            return new ArrayList([{
                ID: 'someID',
                value: 'blue'
            }]);
        };

        options = {
            variationModel: productMock.variationModel,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: { color: { value: 'blue' } },
            apiProduct: productMock,
            productType: 'master'
        };

        var result = productFactory.get(params);

        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return full product model for product type master with variables', function () {
        var params = {
            pid: 'someID',
            variables: {
                color: {
                    value: null
                }
            }
        };
        productMock.master = true;
        productMock.variationModel.master = true;
        options = {
            variationModel: productMock.variationModel,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: { color: { value: null } },
            apiProduct: productMock,
            productType: 'master'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return full product model for product type master without variables', function () {
        var params = {
            pid: 'someID'
        };
        productMock.master = true;
        productMock.variationModel.master = true;
        options = {
            variationModel: productMock.variationModel,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'master'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'full product');
        assert.isTrue(stubFullProduct.calledWith({}, options.apiProduct, options));
    });

    it('should return product tile model', function () {
        var params = {
            pid: 'someID',
            pview: 'tile'
        };
        productMock.master = true;
        var result = productFactory.get(params);

        assert.equal(result, 'product tile');
        assert.isTrue(stubProductTile.calledWith({}, productMock, 'master'));
    });

    it('should return product line item model', function () {
        var params = {
            pid: 'someID',
            pview: 'productLineItem',
            lineItem: {
                optionProductLineItems: new ArrayList([])
            }
        };
        var result = productFactory.get(params);

        assert.equal(result, 'product line item');
    });

    it('should return product line item model for a line item that has options with multiple values', function () {
        var params = {
            pid: 'someID',
            pview: 'productLineItem',
            containerView: 'test',
            lineItem: {
                optionProductLineItems: new ArrayList([{
                    productName: 'someName',
                    optionID: 'someID',
                    optionValueID: 'someValue'

                }])
            }
        };
        productMock.optionModel = {
            options: new ArrayList([{ productName: 'someName',
                optionID: 'someID',
                optionValueID: 'someValue' }]),
            getSelectedOptionValue: function () {
                return { displayValue: 'someValue' };
            }
        };
        var result = productFactory.get(params);
        assert.equal(result, 'product line item');
        assert.isTrue(stubProductLineItem.calledWith({}, productMock));
    });

    it('should return product line item model for a line item that has options', function () {
        var params = {
            pid: 'someID',
            pview: 'productLineItem',
            lineItem: {
                optionProductLineItems: new ArrayList([{
                    productName: 'someName'
                }])
            }
        };
        var result = productFactory.get(params);

        assert.equal(result, 'product line item');
    });

    it('should return product line item model for a line item that has options', function () {
        var params = {
            pid: 'someID',
            pview: 'productLineItem',
            lineItem: {
                optionProductLineItems: new ArrayList([])
            }
        };

        productMock.optionModel = {
            options: new ArrayList([{ displayName: 'someName' }]),
            getSelectedOptionValue: function () {
                return { displayValue: 'someValue' };
            }
        };
        var result = productFactory.get(params);

        assert.equal(result, 'product line item');
    });

    it('should return product line item model when variables are present and lineItem has no options ', function () {
        var params = {
            pid: 'someID',
            pview: 'productLineItem',
            lineItem: {
                optionProductLineItems: optionProductLineItems
            },
            variables: {
                color: {
                    value: 'blue'
                }
            }
        };

        productMock.variationModel.selectedVariant = true;
        productMock.optionModel = {
            options: new ArrayList([{ displayName: 'someName' }]),
            getSelectedOptionValue: function () {
                return { displayValue: 'someValue' };
            }
        };
        var result = productFactory.get(params);

        assert.equal(result, 'product line item');
        assert.isTrue(stubProductLineItem.calledWith({}, productMock));
    });

    it('should return bundle line item model', function () {
        var params = {
            pid: 'someID',
            pview: 'productLineItem',
            lineItem: {}
        };
        productMock.bundle = true;
        options = {
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            lineItem: {},
            productType: 'bundle'
        };
        var result = productFactory.get(params);

        assert.equal(result, 'bundle line item');
        assert.isTrue(stubBundleLineItem.calledWith({}, productMock, options, productFactory));
    });

    it('should return bonus product line item model', function () {
        var params = {
            pid: 'someID',
            pview: 'bonusProductLineItem',
            lineItem: {
                optionProductLineItems: new ArrayList([])
            }
        };
        var result = productFactory.get(params);

        assert.equal(result, 'bonus product line item');
    });

    it('should return bonus product line item model for a bonus line item that has options', function () {
        var params = {
            pid: 'someID',
            pview: 'bonusProductLineItem',
            lineItem: {
                optionProductLineItems: new ArrayList([{
                    productName: 'someName'
                }])
            }
        };
        var result = productFactory.get(params);

        assert.equal(result, 'bonus product line item');
    });

    it('should return bonus product line item model when variables are present and bonus line item has no options ', function () {
        var params = {
            pid: 'someID',
            pview: 'bonusProductLineItem',
            lineItem: {
                optionProductLineItems: optionProductLineItems
            },
            variables: {
                color: {
                    value: 'blue'
                }
            }
        };

        productMock.variationModel.selectedVariant = true;
        productMock.optionModel = {
            options: new ArrayList([{ displayName: 'someName' }]),
            getSelectedOptionValue: function () {
                return { displayValue: 'someValue' };
            }
        };
        var result = productFactory.get(params);

        assert.equal(result, 'bonus product line item');
        assert.isTrue(stubBonusProductLineItem.calledWith({}, productMock));
    });

    it('should return bonus product model for product type master', function () {
        var params = {
            pid: 'someID',
            pview: 'bonus',
            lineItem: {
                optionProductLineItems: new ArrayList([])
            },
            duuid: 'duuid'
        };

        productMock.master = true;
        options = {
            variationModel: null,
            options: undefined,
            optionModel: 'optionModel',
            promotions: 'promotions',
            quantity: undefined,
            variables: undefined,
            apiProduct: productMock,
            productType: 'master'
        };
        var result = productFactory.get(params);


        assert.equal(result, 'bonus product');
        assert.isTrue(stubBonusProduct.calledWith({}, options.apiProduct, options, params.duuid));
    });
});
