var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var cheerio = require('cheerio');

/**
 * Test Case :
 * Verify 'SearchServices-GetSuggestions?q=tops' call submitted successful and the response contains the following :
 * - Do you mean? Tops
 * - Products : Log Sleeve Turtleneck Top; Cowl Neck Top; Paisley Turtleneck Top
 * - Categories : Tops; Top Sellers
 * - Content : FAQs
 */

describe('Search As You Type - general product', function () {
    this.timeout(5000);

    var product = 'Tops';
    var myRequest = {
        url: '',
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    it('should remove line item', function (done) {
        myRequest.url = config.baseUrl + '/SearchServices-GetSuggestions?q=' + product;
        request(myRequest, function (error, response) {
            assert.equal(response.statusCode, 200, 'Expected GET SearchServices-GetSuggestions call statusCode to be 200.');
            var $ = cheerio.load(response.body);

            var prod = $('.container a');
            // Determining if pretty-URLs is enabled to differentiate test case usage
            var prettyURL = prod.get(0).attribs.href;
            if (prettyURL.includes('/s/RefArch/')) {
                assert.equal(prod.get(0).children[0].data.trim(), 'tops');
                assert.include(prod.get(2).children[0].data.trim(), 'Top', 'returned product name should contain "Top"');
                assert.include(prod.get(4).children[0].data.trim(), 'Top', 'returned product name should contain "Top"');
                assert.include(prod.get(6).children[0].data.trim(), 'Top', 'returned product name should contain "Top"');
                assert.equal(prod.get(8).children[0].data.trim(), 'Tops');
                assert.equal(prod.get(9).children[0].data.trim(), 'Top Sellers');
                assert.equal(prod.get(10).children[0].data.trim(), 'FAQs');
            } else {
                assert.equal(prod.get(0).children[0].next.data.trim(), 'tops');
                assert.include(prod.get(2).children[0].next.data.trim(), 'Top', 'returned product name should contain "Top"');
                assert.include(prod.get(4).children[0].next.data.trim(), 'Top', 'returned product name should contain "Top"');
                assert.include(prod.get(6).children[0].next.data.trim(), 'Top', 'returned product name should contain "Top"');
                assert.equal(prod.get(8).children[0].next.data.trim(), 'Tops');
                assert.equal(prod.get(9).children[0].next.data.trim(), 'Top Sellers');
                assert.equal(prod.get(10).children[0].next.data.trim(), 'FAQs');
            }

            var category = $('.justify-content-end.header div');
            assert.equal(category.get(0).children[0].data.trim(), 'Do you mean?');
            assert.equal(category.get(1).children[0].data.trim(), 'Products');
            assert.equal(category.get(2).children[0].data.trim(), 'Categories');
            assert.equal(category.get(3).children[0].data.trim(), 'Content');
            done();
        });
    });
});
