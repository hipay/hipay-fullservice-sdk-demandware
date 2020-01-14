'use strict';

var server = require('server');


server.get('Product', function (req, res, next) {
    var newFactory = require('*/cartridge/scripts/factories/product');
    res.json({ product: newFactory.get({ pid: req.querystring.pid, pview: req.querystring.pview }) });
    next();
});

server.get('NewGrid', function (req, res, next) {
    var newFactory = require('*/cartridge/scripts/factories/product');
    var products = [
        '25696638', '25593800', '25642296', '25642436', '25771342', '25589408', '25592479', '25591426', '25503603', '25593727', '25688632', '25720424', '25591911', '25593518', '25688443', '25795715', '25565616', '25744206', '25696630', '25591704', '25503585', '25592581', '25642181', '25697212',
        '78916783', '91736743', '44736828', '69309284', '21736758', '86736887', '83536828', '82916781', '25686364', '25686544', '22416787', '34536828', '73910432', '73910532', '25585429', '56736828', '72516759', '25604455', '25686395', '25604524', '25686571', '11736753', '42946931', '82516743'
    ];
    var productModels = products.map(function (product) {
        return newFactory.get({ pid: product, pview: 'tile' });
    });
    res.json({ products: productModels });
    next();
});

server.get('Form', function (req, res, next) {
    var form = server.forms.getForm('address');
    res.render('form.isml', { form: form });
    next();
});

server.post('Submit', function (req, res, next) {
    this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var form = server.forms.getForm('address');
        if (!form.valid) {
            res.setStatusCode(500);
        }
        res.json({ form: server.forms.getForm('address') });
    });
    next();
});

module.exports = server.exports();
