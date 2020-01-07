var assert = require('chai').assert;
var request = require('request');
var config = require('../it.config');
var jsonHelpers = require('../helpers/jsonUtils');
var urlHelpers = require('../helpers/urlUtils');

describe('ProductVariation - Get product variation with only master product ID', function () {
    this.timeout(5000);

    var masterPid = '25604455M';
    var myGetRequest = {
        url: '',
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    it('should returns master product details and variant attributes', function (done) {
        var resourcePath = config.baseUrl + '/Product-Variation?';
        myGetRequest.url = resourcePath + 'pid=' + masterPid;

        var expectedResBody = {
            'action': 'Product-Variation',
            'product': {
                'attributes': null,
                'attributesHtml': '\n\n\n',
                'availability': {
                    'inStockDate': null,
                    'messages': ['In Stock']
                },
                'id': masterPid,
                'productName': 'No-Iron Textured Dress Shirt',
                'shortDescription': 'This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.',
                'longDescription': 'This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.',
                'options': [],
                'selectedQuantity': 1,
                'selectedProductUrl': '/on/demandware.store/Sites-RefArch-Site/en_US/Product-Show?pid=25604455M',
                'minOrderQuantity': 1,
                'maxOrderQuantity': 9,
                'sizeChartId': null,
                'variationAttributes': [
                    {
                        'attributeId': 'color',
                        'displayName': 'Color',
                        'id': 'color',
                        'swatchable': true,
                        'values': [
                            {
                                'id': 'SLABLFB',
                                'description': null,
                                'displayValue': 'Slate',
                                'value': 'SLABLFB',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_color=SLABLFB',
                                'images': {
                                    'swatch': [{
                                        'alt': 'No-Iron Textured Dress Shirt, Slate, swatch',
                                        'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw7a85aeb2/images/swatch/PG.15J0037EJ.SLABLFB.CP.jpg',
                                        'title': 'No-Iron Textured Dress Shirt, Slate'
                                    }]
                                }
                            },
                            {
                                'id': 'WHITEFB',
                                'description': null,
                                'displayValue': 'White',
                                'value': 'WHITEFB',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_color=WHITEFB',
                                'images': {
                                    'swatch': [{
                                        'alt': 'No-Iron Textured Dress Shirt, White, swatch',
                                        'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw80b5ac36/images/swatch/PG.15J0037EJ.WHITEFB.CP.jpg',
                                        'title': 'No-Iron Textured Dress Shirt, White'
                                    }]
                                }
                            }
                        ]
                    },
                    {
                        'attributeId': 'size',
                        'displayName': 'Size',
                        'id': 'size',
                        'resetUrl': myGetRequest.url + '&dwvar_25604455M_size=',
                        'swatchable': false,
                        'values': [
                            {
                                'id': '145',
                                'description': null,
                                'displayValue': '14 1/2',
                                'value': '145',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=145'
                            },
                            {
                                'id': '150',
                                'description': null,
                                'displayValue': '15',
                                'value': '150',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=150'
                            },
                            {
                                'id': '155',
                                'description': null,
                                'displayValue': '15 1/2',
                                'value': '155',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=155'
                            },
                            {
                                'id': '160',
                                'description': null,
                                'displayValue': '16',
                                'value': '160',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=160'
                            },
                            {
                                'id': '165',
                                'description': null,
                                'displayValue': '16 1/2',
                                'value': '165',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=165'
                            },
                            {
                                'id': '170',
                                'description': null,
                                'displayValue': '17',
                                'value': '170',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=170'
                            },
                            {
                                'id': '175',
                                'description': null,
                                'displayValue': '17 1/2',
                                'value': '175',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=175'
                            },
                            {
                                'id': '180',
                                'description': null,
                                'displayValue': '18',
                                'value': '180',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=180'
                            },
                            {
                                'id': '185',
                                'description': null,
                                'displayValue': '18 1/2',
                                'value': '185',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=185'
                            },
                            {
                                'id': '190',
                                'description': null,
                                'displayValue': '19',
                                'value': '190',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=190'
                            },
                            {
                                'id': '200',
                                'description': null,
                                'displayValue': '20',
                                'value': '200',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=200'
                            },
                            {
                                'id': '220',
                                'description': null,
                                'displayValue': '22',
                                'value': '220',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_size=220'
                            }
                        ]
                    },
                    {
                        'attributeId': 'width',
                        'displayName': 'Width',
                        'id': 'width',
                        'resetUrl': myGetRequest.url + '&dwvar_25604455M_width=',
                        'swatchable': false,
                        'values': [
                            {
                                'id': 'A',
                                'description': null,
                                'displayValue': '32/33',
                                'value': 'A',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_width=A'
                            },
                            {
                                'id': 'B',
                                'description': null,
                                'displayValue': '34/35',
                                'value': 'B',
                                'selected': false,
                                'selectable': true,
                                'url': myGetRequest.url + '&dwvar_25604455M_width=B'
                            }
                        ]
                    }
                ],
                'price': {
                    'html': '\n\n\n\n    <div class="price"  itemprop="offers" itemscope itemtype="http://schema.org/Offer">\n        \n        <span>\n    \n\n    \n        \n        <meta itemprop="priceCurrency" content="USD" />\n        <span class="strike-through list">\n            <span class="value" itemprop="price" content="69.50">\n                $69.50\n\n\n            </span>\n        </span>\n    \n\n    \n    <meta itemprop="priceCurrency" content="USD" />\n    <span class="sales">\n        \n        \n        \n            <span class="value" itemprop="price" content="49.99">\n        \n        $49.99\n\n\n        </span>\n    </span>\n</span>\n\n    </div>\n\n\n',
                    'list': {
                        'currency': 'USD',
                        'decimalPrice': '69.50',
                        'formatted': '$69.50',
                        'value': 69.5
                    },
                    'sales': {
                        'currency': 'USD',
                        'decimalPrice': '49.99',
                        'formatted': '$49.99',
                        'value': 49.99
                    }
                },
                'images': {
                    'large': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw8f141f96/images/large/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwadb01158/images/large/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        }
                    ],
                    'small': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe65fe261/images/small/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, , small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe28073fd/images/small/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, '
                        }
                    ]
                },
                'available': true,
                'readyToOrder': false,
                'promotions': null,
                'quantities': [
                    {
                        'selected': true,
                        'value': '1'
                    },
                    {
                        'selected': false,
                        'value': '2'
                    },
                    {
                        'selected': false,
                        'value': '3'
                    },
                    {
                        'selected': false,
                        'value': '4'
                    },
                    {
                        'selected': false,
                        'value': '5'
                    },
                    {
                        'selected': false,
                        'value': '6'
                    },
                    {
                        'selected': false,
                        'value': '7'
                    },
                    {
                        'selected': false,
                        'value': '8'
                    },
                    {
                        'selected': false,
                        'value': '9'
                    }
                ],
                'rating': 3.3,
                'productType': 'master'
            },
            'queryString': 'pid=25604455M',
            'locale': 'en_US',
            'resources': {
                'info_selectforstock': 'Select Styles for Availability'
            }

        };

        // strip out all "url" properties from the expected response
        var expectedResBodyStripped = jsonHelpers.deleteProperties(expectedResBody, ['url', 'resetUrl', 'selectedProductUrl']);

        request(myGetRequest, function (error, response) {
            assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

            // Remove basic auth - to use intergration tests on test instances

            var bodyAsJson = JSON.parse(response.body);

            // strip out all "url" properties from the actual response
            var actualRespBodyStripped = jsonHelpers.deleteProperties(bodyAsJson, ['url', 'resetUrl', 'selectedProductUrl', 'raw']);

            assert.containSubset(actualRespBodyStripped, expectedResBodyStripped, 'Actual response not as expected.');

            // Verify URL for product.variationAttributes of color = SLABLFB
            var attrColorBlue = bodyAsJson.product.variationAttributes[0].values[0];

            // Clean the resourcePath if basic auth is set
            var resourcePathCleaned = urlHelpers.stripBasicAuth(resourcePath);

            assert.equal(attrColorBlue.url, resourcePathCleaned + 'dwvar_25604455M_color=SLABLFB&pid=25604455M&quantity=1', 'Actual color attribute = SLABLFB: url not as expected.');
            var colorBlueImages = attrColorBlue.images;
            assert.isTrue(colorBlueImages.swatch[0].url.endsWith('SLABLFB.CP.jpg'), 'color SLABLFB image swatch[0]: url not ended with SLABLFB.CP.jpg.');

            // Verify URL for product.variationAttributes of color = WHITEFB
            var attrColorWhite = bodyAsJson.product.variationAttributes[0].values[1];
            assert.equal(attrColorWhite.url, resourcePathCleaned + 'dwvar_25604455M_color=WHITEFB&pid=25604455M&quantity=1', 'Actual color attribute = WHITEFB: url not as expected.');

            var colorWhiteImages = attrColorWhite.images;
            assert.isTrue(colorWhiteImages.swatch[0].url.endsWith('WHITEFB.CP.jpg'), 'color WHITEFB image swatch[0].url not ended with WHITEFB.CP.jpg.');

            // Verify URL for product.variationAttributes of Size of id = 145
            assert.equal(bodyAsJson.product.variationAttributes[1].values[0].url, resourcePathCleaned + 'dwvar_25604455M_size=145&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[0].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 150
            assert.equal(bodyAsJson.product.variationAttributes[1].values[1].url, resourcePathCleaned + 'dwvar_25604455M_size=150&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[1].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 155
            assert.equal(bodyAsJson.product.variationAttributes[1].values[2].url, resourcePathCleaned + 'dwvar_25604455M_size=155&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[2].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 160
            assert.equal(bodyAsJson.product.variationAttributes[1].values[3].url, resourcePathCleaned + 'dwvar_25604455M_size=160&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[3].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 165
            assert.equal(bodyAsJson.product.variationAttributes[1].values[4].url, resourcePathCleaned + 'dwvar_25604455M_size=165&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[4].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 170
            assert.equal(bodyAsJson.product.variationAttributes[1].values[5].url, resourcePathCleaned + 'dwvar_25604455M_size=170&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[5].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 175
            assert.equal(bodyAsJson.product.variationAttributes[1].values[6].url, resourcePathCleaned + 'dwvar_25604455M_size=175&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[6].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 180
            assert.equal(bodyAsJson.product.variationAttributes[1].values[7].url, resourcePathCleaned + 'dwvar_25604455M_size=180&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[7].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 185
            assert.equal(bodyAsJson.product.variationAttributes[1].values[8].url, resourcePathCleaned + 'dwvar_25604455M_size=185&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[8].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 190
            assert.equal(bodyAsJson.product.variationAttributes[1].values[9].url, resourcePathCleaned + 'dwvar_25604455M_size=190&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[9].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 200
            assert.equal(bodyAsJson.product.variationAttributes[1].values[10].url, resourcePathCleaned + 'dwvar_25604455M_size=200&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[10].url not as expected.');

            // Verify URL for product.variationAttributes of Size of id = 220
            assert.equal(bodyAsJson.product.variationAttributes[1].values[11].url, resourcePathCleaned + 'dwvar_25604455M_size=220&pid=25604455M&quantity=1', 'Actual product.variationAttributes[1].values[11].url not as expected.');

            // Verify URL for product.variationAttributes of width = A (32/33)
            assert.equal(bodyAsJson.product.variationAttributes[2].values[0].url, resourcePathCleaned + 'dwvar_25604455M_width=A&pid=25604455M&quantity=1', 'Actual product.variationAttributes[2].values[0].url not as expected.');

            // Verify URL for product.variationAttributes of width = B (34/35)
            assert.equal(bodyAsJson.product.variationAttributes[2].values[1].url, resourcePathCleaned + 'dwvar_25604455M_width=B&pid=25604455M&quantity=1', 'Actual product.variationAttributes[2].values[1].url not as expected.');

            // Verify URL for product.variationAttributes of images
            var prodImages = bodyAsJson.product.images;
            assert.isTrue(prodImages.large[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image large[0]: url not ended with WHITEFB.PZ.jpg');
            assert.isTrue(prodImages.large[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image large[1]: url not ended with WHITEFB.BZ.jpg');
            assert.isTrue(prodImages.small[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image small[0]: url not ended with WHITEFB.PZ.jpg');
            assert.isTrue(prodImages.small[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image small[1]: url not ended with WHITEFB.BZ.jpg');

            done();
        });
    });
});
