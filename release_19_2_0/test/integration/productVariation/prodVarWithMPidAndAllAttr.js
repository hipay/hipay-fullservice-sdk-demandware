var assert = require('chai').assert;
var request = require('request');
var _ = require('lodash');
var config = require('../it.config');
var jsonHelpers = require('../helpers/jsonUtils');
var urlHelpers = require('../helpers/urlUtils');

describe('ProductVariation - Get product variation with master product ID and all required variation attributes', function () {
    this.timeout(5000);

    var masterPid = '25604455M';
    var paramColorWhite = 'dwvar_25604455M_color=WHITEFB';
    var paramSize160 = 'dwvar_25604455M_size=160';
    var paramWidth3233 = 'dwvar_25604455M_width=A';
    var expectedVariant = '708141676220M';

    var myGetRequest = {
        url: '',
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    it('should returns variant for the selected attributes', function (done) {
        var urlEndPoint = config.baseUrl + '/Product-Variation';
        var urlWithMpid = urlEndPoint + '?pid=' + masterPid;
        myGetRequest.url = urlWithMpid + '&' + paramColorWhite + '&' + paramSize160 + '&' + paramWidth3233;

        var expectedResBody = {
            'action': 'Product-Variation',
            'product': {
                'attributes': null,
                'attributesHtml': '\n\n\n',
                'availability': {
                    'inStockDate': 'Sun Jul 15 2012',
                    'messages': ['Back Order']
                },
                'id': expectedVariant,
                'productName': 'No-Iron Textured Dress Shirt',
                'shortDescription': 'This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.',
                'longDescription': 'This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.',
                'options': [],
                'selectedProductUrl': '/on/demandware.store/Sites-RefArch-Site/en_US/Product-Show?pid=25604455M&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A&dwvar_25604455M_size=160',
                'minOrderQuantity': 1,
                'maxOrderQuantity': 9,
                'selectedQuantity': 1,
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
                                'url': urlWithMpid + '&dwvar_25604455M_color=SLABLFB&dwvar_25604455M_size=160&dwvar_25604455M_width=A',
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
                                'selected': true,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_color=&dwvar_25604455M_size=160&dwvar_25604455M_width=A',
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
                        'resetUrl': urlWithMpid + '&dwvar_25604455M_size=&dwvar_25604455M_width=A&dwvar_25604455M_color=WHITEFB',
                        'swatchable': false,
                        'values': [
                            {
                                'id': '145',
                                'description': null,
                                'displayValue': '14 1/2',
                                'value': '145',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_size=145&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A'
                            },
                            {
                                'id': '150',
                                'description': null,
                                'displayValue': '15',
                                'value': '150',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_size=150&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A'
                            },
                            {
                                'id': '155',
                                'description': null,
                                'displayValue': '15 1/2',
                                'value': '155',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_size=155&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A'
                            },
                            {
                                'id': '160',
                                'description': null,
                                'displayValue': '16',
                                'value': '160',
                                'selected': true,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_size=&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A'
                            },
                            {
                                'id': '165',
                                'description': null,
                                'displayValue': '16 1/2',
                                'value': '165',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_size=165&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A'
                            },
                            {
                                'id': '170',
                                'description': null,
                                'displayValue': '17',
                                'value': '170',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_size=170&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A'
                            },
                            {
                                'id': '175',
                                'description': null,
                                'displayValue': '17 1/2',
                                'value': '175',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '180',
                                'description': null,
                                'displayValue': '18',
                                'value': '180',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_size=180&dwvar_25604455M_color=WHITEFB&dwvar_25604455M_width=A'
                            },
                            {
                                'id': '185',
                                'description': null,
                                'displayValue': '18 1/2',
                                'value': '185',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '190',
                                'description': null,
                                'displayValue': '19',
                                'value': '190',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '200',
                                'description': null,
                                'displayValue': '20',
                                'value': '200',
                                'selected': false,
                                'selectable': false
                            },
                            {
                                'id': '220',
                                'description': null,
                                'displayValue': '22',
                                'value': '220',
                                'selected': false,
                                'selectable': false
                            }
                        ]
                    },
                    {
                        'attributeId': 'width',
                        'displayName': 'Width',
                        'id': 'width',
                        'resetUrl': urlWithMpid + '&dwvar_25604455M_width=&dwvar_25604455M_size=160&dwvar_25604455M_color=WHITEFB',
                        'swatchable': false,
                        'values': [
                            {
                                'id': 'A',
                                'description': null,
                                'displayValue': '32/33',
                                'value': 'A',
                                'selected': true,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_width=&dwvar_25604455M_size=160&dwvar_25604455M_color=WHITEFB'
                            },
                            {
                                'id': 'B',
                                'description': null,
                                'displayValue': '34/35',
                                'value': 'B',
                                'selected': false,
                                'selectable': true,
                                'url': urlWithMpid + '&dwvar_25604455M_width=B&dwvar_25604455M_size=160&dwvar_25604455M_color=WHITEFB'
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
                            'alt': 'No-Iron Textured Dress Shirt, White, large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dw8f141f96/images/large/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, White, large',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwadb01158/images/large/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        }
                    ],
                    'small': [
                        {
                            'alt': 'No-Iron Textured Dress Shirt, White, small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe65fe261/images/small/PG.15J0037EJ.WHITEFB.PZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        },
                        {
                            'alt': 'No-Iron Textured Dress Shirt, White, small',
                            'url': '/on/demandware.static/-/Sites-apparel-catalog/default/dwe28073fd/images/small/PG.15J0037EJ.WHITEFB.BZ.jpg',
                            'title': 'No-Iron Textured Dress Shirt, White'
                        }
                    ]
                },
                'available': true,
                'readyToOrder': true,
                'productType': 'variant',
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
                'rating': 4.8
            },
            'queryString': 'dwvar_25604455M_color=WHITEFB&dwvar_25604455M_size=160&dwvar_25604455M_width=A&pid=25604455M',
            'locale': 'en_US',
            'resources': {
                'info_selectforstock': 'Select Styles for Availability'
            }

        };

        // strip out all "url" properties from the expected response
        var expectedResBodyStripped = jsonHelpers.deleteProperties(expectedResBody, ['url', 'resetUrl', 'selectedProductUrl']);

        request(myGetRequest, function (error, response) {
            assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

            var bodyAsJson = JSON.parse(response.body);

            // strip out all "url" properties from the actual response
            var actualRespBodyStripped = jsonHelpers.deleteProperties(bodyAsJson, ['url', 'resetUrl', 'selectedProductUrl', 'raw']);

            assert.containSubset(actualRespBodyStripped, expectedResBodyStripped, 'Actual response not as expected.');

            // Verify URL for product.variationAttributes of color = SLABLFB
            var attrColorBlue = bodyAsJson.product.variationAttributes[0].values[0];
            var urlSplit1 = attrColorBlue.url.split('?');
            var urlParams = urlSplit1[1].split('&');
            var urlEndPointCleaned = urlHelpers.stripBasicAuth(urlEndPoint);
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Color with id = SLABLFB: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Color with id = SLABLFB: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Color with id = SLABLFB: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Color with id = SLABLFB: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=SLABLFB'), 'product.variationAttributes Color with id = SLABLFB: url not include parameter dwvar_25604455M_color=SLABLFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=160'), 'product.variationAttributes Color with id = SLABLFB: url not include parameter dwvar_25604455M_size=160');

            var colorBlueImages = attrColorBlue.images;
            assert.isTrue(colorBlueImages.swatch[0].url.endsWith('SLABLFB.CP.jpg'), 'color SLABLFB image swatch[0]: url not ended with SLABLFB.CP.jpg.');

            // Verify URL for product.variationAttributes of color = WHITEFB
            var attrColorWhite = bodyAsJson.product.variationAttributes[0].values[1];
            urlSplit1 = attrColorWhite.url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Color with id = WHITEFB: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Color with id = WHITEFB: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Color with id = WHITEFB: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Color with id = WHITEFB: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color='), 'product.variationAttributes Color with id = WHITEFB: url not include parameter dwvar_25604455M_color=');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=160'), 'product.variationAttributes Color with id = WHITEFB: url not include parameter dwvar_25604455M_size=160');

            var colorWhiteImages = attrColorWhite.images;
            assert.isTrue(colorWhiteImages.swatch[0].url.endsWith('WHITEFB.CP.jpg'), 'color WHITEFB image swatch[0]: url not ended with WHITEFB.CP.jpg.');

            // Verify URL for product.variationAttributes Size with id = 145
            urlSplit1 = bodyAsJson.product.variationAttributes[1].values[0].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = 145: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = 145: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = 145: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Size with id = 145: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = 145: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=145'), 'product.variationAttributes Size with id = 145: url not include parameter dwvar_25604455M_size=145');

            // Verify URL for product.variationAttributes of Size of id = 150
            urlSplit1 = bodyAsJson.product.variationAttributes[1].values[1].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = 150: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = 150: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = 150: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Size with id = 150: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = 150: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=150'), 'product.variationAttributes Size with id = 150: url not include parameter dwvar_25604455M_size=150');

            // Verify URL for product.variationAttributes Size with id = 155
            urlSplit1 = bodyAsJson.product.variationAttributes[1].values[2].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = 155: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = 155: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = 155: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Size with id = 155: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = 155: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=155'), 'product.variationAttributes Size with id = 155: url not include parameter dwvar_25604455M_size=155');

            // Verify URL for product.variationAttributes Size with id = 160
            urlSplit1 = bodyAsJson.product.variationAttributes[1].values[3].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = 160: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = 160: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = 160: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Size with id = 160: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = 160: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size='), 'product.variationAttributes Size with id = 160: url not include parameter dwvar_25604455M_size=');

            // Verify URL for product.variationAttributes Size with id = 165
            urlSplit1 = bodyAsJson.product.variationAttributes[1].values[4].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = 165: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = 165 url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = 165: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Size with id = 165: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = 165: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=165'), 'product.variationAttributes Size with id = 165: url not include parameter dwvar_25604455M_size=165');

            // Verify URL for product.variationAttributes Size with id = 170
            urlSplit1 = bodyAsJson.product.variationAttributes[1].values[5].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = 170: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = 170 url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = 170: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Size with id = 170: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = 170: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=170'), 'product.variationAttributes Size with id = 170: url not include parameter dwvar_25604455M_size=170');

            // Verify URL for product.variationAttributes Size with id = 180
            urlSplit1 = bodyAsJson.product.variationAttributes[1].values[7].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = 180: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = 180 url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = 180: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=A'), 'product.variationAttributes Size with id = 180: url not include parameter dwvar_25604455M_width=A');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = 180: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=180'), 'product.variationAttributes Size with id = 180: url not include parameter dwvar_25604455M_size=180');

            // Verify URL for product.variationAttributes of width = A (32/33)
            urlSplit1 = bodyAsJson.product.variationAttributes[2].values[0].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = A: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = A: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = A: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width='), 'product.variationAttributes Size with id = A: url not include parameter dwvar_25604455M_width=');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = A: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=160'), 'product.variationAttributes Size with id = A: url not include parameter dwvar_25604455M_size=160');

            // Verify URL for product.variationAttributes of width = B (34/35)
            urlSplit1 = bodyAsJson.product.variationAttributes[2].values[1].url.split('?');
            urlParams = urlSplit1[1].split('&');
            assert.equal(urlSplit1[0], urlEndPointCleaned, 'product.variationAttributes Size with id = B: actual request end point not equal expected value.');
            assert.equal(urlParams.length, 5, 'product.variationAttributes Size with id = B: url does not have 5 parameters.');
            assert.isTrue(_.includes(urlParams, 'pid=' + masterPid), 'product.variationAttributes Size with id = B: url not include parameter pid=' + masterPid);
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_width=B'), 'product.variationAttributes Size with id = B: url not include parameter dwvar_25604455M_width=B');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_color=WHITEFB'), 'product.variationAttributes Size with id = B: url not include parameter dwvar_25604455M_color=WHITEFB');
            assert.isTrue(_.includes(urlParams, 'dwvar_25604455M_size=160'), 'product.variationAttributes Size with id = B: url not include parameter dwvar_25604455M_size=160');

            // Verify URL for product.variationAttributes of images
            var prodImages = bodyAsJson.product.images;
            assert.isTrue(prodImages.large[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image large[0]: url not ended with WHITEFB.PZ.jpg.');
            assert.isTrue(prodImages.large[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image large[1]: url not ended with WHITEFB.BZ.jpg.');
            assert.isTrue(prodImages.small[0].url.endsWith('WHITEFB.PZ.jpg'), 'product image small[0]: url not ended with WHITEFB.PZ.jpg.');
            assert.isTrue(prodImages.small[1].url.endsWith('WHITEFB.BZ.jpg'), 'product image small[1]: url not ended with WHITEFB.BZ.jpg.');

            done();
        });
    });
});
