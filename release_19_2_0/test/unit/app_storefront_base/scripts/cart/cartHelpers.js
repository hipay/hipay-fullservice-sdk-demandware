'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');

var ArrayList = require('../../../../mocks/dw.util.Collection.js');

var mockOptions = [{
    optionId: 'option 1',
    selectedValueId: '123'
}];

var availabilityModelMock = {
    inventoryRecord: {
        ATS: {
            value: 3
        }
    }
};

var productLineItemMock = {
    productID: 'someProductID',
    quantity: {
        value: 1
    },
    setQuantityValue: function () {
        return;
    },
    quantityValue: 1,
    product: {
        availabilityModel: availabilityModelMock
    },
    optionProductLineItems: new ArrayList(mockOptions),
    bundledProductLineItems: new ArrayList([])
};

var stubGetBonusLineItems = function () {
    var bonusProducts = [{
        ID: 'pid_1'
    },
    {
        ID: 'pid_2'
    }];
    var index2 = 0;
    var bonusDiscountLineItems = [
        {
            name: 'name1',
            ID: 'ID1',
            description: 'description 1',
            UUID: 'uuid_string',
            maxBonusItems: 1,
            bonusProducts: {
                iterator: function () {
                    return {
                        items: bonusProducts,
                        hasNext: function () {
                            return index2 < bonusProducts.length;
                        },
                        next: function () {
                            return bonusProducts[index2++];
                        }
                    };
                }
            }
        }
    ];
    var index = 0;

    return {
        id: 2,
        name: '',
        iterator: function () {
            return {
                items: bonusDiscountLineItems,
                hasNext: function () {
                    return index < bonusDiscountLineItems.length;
                },
                next: function () {
                    return bonusDiscountLineItems[index++];
                }
            };
        }
    };
};

var createApiBasket = function (productInBasket) {
    var currentBasket = {
        defaultShipment: {},
        createProductLineItem: function () {
            return {
                setQuantityValue: function () {
                    return;
                }
            };
        },
        getBonusDiscountLineItems: stubGetBonusLineItems
    };
    if (productInBasket) {
        currentBasket.productLineItems = new ArrayList([productLineItemMock]);
    } else {
        currentBasket.productLineItems = new ArrayList([]);
    }

    return currentBasket;
};

describe('cartHelpers', function () {
    var findStub = sinon.stub();
    findStub.withArgs([productLineItemMock]).returns(productLineItemMock);

    var cartHelpers = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/cart/cartHelpers', {
        'dw/catalog/ProductMgr': {
            getProduct: function () {
                return {
                    optionModel: {
                        getOption: function () {},
                        getOptionValue: function () {},
                        setSelectedOptionValue: function () {}
                    },
                    availabilityModel: availabilityModelMock
                };
            }
        },
        '*/cartridge/scripts/util/collections': proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
            'dw/util/ArrayList': ArrayList
        }),
        '*/cartridge/scripts/checkout/shippingHelpers': {},
        'dw/system/Transaction': {
            wrap: function (item) {
                item();
            }
        },
        '*/cartridge/scripts/util/array': { find: findStub },
        'dw/web/Resource': {
            msg: function () {
                return 'someString';
            },
            msgf: function () {
                return 'someString';
            }
        },
        '*/cartridge/scripts/helpers/productHelpers': {
            getOptions: function () {},
            getCurrentOptionModel: function () {}
        },
        'dw/web/URLUtils': {
            url: function () {
                return {
                    toString: function () {
                        return 'string URL';
                    }
                };
            }
        }
    });

    it('should add a product to the cart', function () {
        var currentBasket = createApiBasket(false);
        var spy = sinon.spy(currentBasket, 'createProductLineItem');
        spy.withArgs(1);

        cartHelpers.addProductToCart(currentBasket, 'someProductID', 1, [], mockOptions);
        assert.isTrue(spy.calledOnce);
        currentBasket.createProductLineItem.restore();
    });

    it('should set the quantity of the product in the cart', function () {
        var currentBasket = createApiBasket(true);
        var spy = sinon.spy(currentBasket.productLineItems.toArray()[0], 'setQuantityValue');
        spy.withArgs(1);

        cartHelpers.addProductToCart(currentBasket, 'someProductID', 1, [], mockOptions);
        assert.isTrue(spy.calledOnce);
        currentBasket.productLineItems.toArray()[0].setQuantityValue.restore();
    });

    it('should not add a product to the cart', function () {
        var currentBasket = createApiBasket(true);

        var result = cartHelpers.addProductToCart(currentBasket, 'someProductID', 4, [], mockOptions);
        assert.isTrue(result.error);
        assert.equal(result.message, 'someString');
    });

    it('should not add a product to the cart when ATS is already in cart', function () {
        var currentBasket = createApiBasket(true);
        currentBasket.productLineItems.toArray()[0].quantity.value = 3;

        var result = cartHelpers.addProductToCart(currentBasket, 'someProductID', 3, [], mockOptions);
        assert.isTrue(result.error);
        assert.equal(result.message, 'someString');
    });

    describe('getQtyAlreadyInCart() function', function () {
        var productId1 = 'product1';

        it('should provide the quantities of a product already in the Cart', function () {
            var lineItems = new ArrayList([{
                bundledProductLineItems: [],
                productID: productId1,
                quantityValue: 3
            }]);
            var qtyAlreadyInCart = cartHelpers.getQtyAlreadyInCart(productId1, lineItems);
            assert.equal(3, qtyAlreadyInCart);
        });

        it('should provide the quantities of a product inside a bundle already in the Cart',
            function () {
                var lineItems = new ArrayList([{
                    bundledProductLineItems: new ArrayList([{
                        productID: productId1,
                        quantityValue: 4
                    }])
                }]);
                var qtyAlreadyInCart = cartHelpers.getQtyAlreadyInCart(productId1, lineItems);
                assert.equal(4, qtyAlreadyInCart);
            });

        it('should not include the quantity a product matching the uuid', function () {
            var uuid = 'abc';
            var lineItems = new ArrayList([{
                bundledProductLineItems: [],
                productID: productId1,
                quantityValue: 5,
                UUID: uuid
            }]);
            var qtyAlreadyInCart = cartHelpers.getQtyAlreadyInCart(productId1, lineItems, uuid);
            assert.equal(0, qtyAlreadyInCart);
        });

        it('should not include the quantity a product inside a bundle matching the uuid',
            function () {
                var uuid = 'abc';
                var lineItems = new ArrayList([{
                    bundledProductLineItems: new ArrayList([{
                        productID: productId1,
                        quantityValue: 4,
                        UUID: uuid
                    }])
                }]);
                var qtyAlreadyInCart = cartHelpers.getQtyAlreadyInCart(productId1, lineItems, uuid);
                assert.equal(0, qtyAlreadyInCart);
            }
        );

        it('should add a product to the cart that is eligible for bonus products', function () {
            var currentBasket = createApiBasket(false);
            var spy = sinon.spy(currentBasket, 'createProductLineItem');
            spy.withArgs(1);

            var previousBonusDiscountLineItems = cartHelpers.addProductToCart(currentBasket, 'someProductID', 1, [], mockOptions);
            previousBonusDiscountLineItems.contains = function (x) {
                var expectedResult = {
                    name: 'name1',
                    ID: 'ID1',
                    description: 'description 1',
                    UUID: 'uuid_string',
                    maxBonusItems: 1
                };
                return expectedResult === x;
            };
            var urlObject = {
                url: 'Cart-ChooseBonusProducts',
                configureProductstUrl: 'Product-ShowBonusProducts',
                addToCartUrl: 'Cart-AddBonusProducts'
            };

            var newBonusDiscountLineItem =
                cartHelpers.getNewBonusDiscountLineItem(
                    currentBasket,
                    previousBonusDiscountLineItems,
                    urlObject
            );
            assert.equal(newBonusDiscountLineItem.maxBonusItems, 1);
            assert.equal(newBonusDiscountLineItem.addToCartUrl, 'Cart-AddBonusProducts');
            assert.equal(newBonusDiscountLineItem.configureProductstUrl, 'string URL');
            assert.equal(newBonusDiscountLineItem.uuid, 'uuid_string');
            assert.equal(newBonusDiscountLineItem.bonuspids.length, 2);
            assert.equal(newBonusDiscountLineItem.bonuspids[0], 'pid_1');
            assert.equal(newBonusDiscountLineItem.bonuspids[1], 'pid_2');
            assert.equal(newBonusDiscountLineItem.newBonusDiscountLineItem.name, 'name1');
            assert.equal(newBonusDiscountLineItem.newBonusDiscountLineItem.ID, 'ID1');
            assert.equal(newBonusDiscountLineItem.newBonusDiscountLineItem.maxBonusItems, 1);
            assert.equal(newBonusDiscountLineItem.newBonusDiscountLineItem.description, 'description 1');
            assert.equal(newBonusDiscountLineItem.labels.close, 'someString');
            assert.equal(newBonusDiscountLineItem.labels.selectprods, 'someString');
        });
    });
});
