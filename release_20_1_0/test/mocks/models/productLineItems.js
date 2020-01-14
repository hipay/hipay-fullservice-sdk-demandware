'use strict';

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var collections = require('../util/collections');

function proxyModel() {
    return proxyquire('../../../cartridges/app_storefront_base/cartridge/models/productLineItems', {
        'dw/web/URLUtils': {
            staticURL: function() {
                return 'someString'
            }
        },
        'dw/web/Resource': {
            msg: function () {
                return 'someString';
            },
            msgf: function () {
                return 'someString';
            }
        },
        '*/cartridge/scripts/util/collections': collections,
        '*/cartridge/scripts/factories/product': {
            get: function () {
                return { bonusProducts: null, bonusProductLineItemUUID: null };
            }
        }
    });
}

module.exports = proxyModel();
