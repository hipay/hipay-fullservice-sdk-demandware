'use strict';

var server = require('server');

server.get('Landing', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');

    res.render('contactUs/contactUs.isml', {
        actionUrl: URLUtils.url('ContactUs-Subscribe').toString()
    });

    next();
});

server.post('Subscribe', server.middleware.https, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    var emailHelper = require('*/cartridge/scripts/helpers/emailHelpers');

    var myForm = req.form;
    var isValidEmailid = emailHelper.validateEmail(myForm.contactEmail);
    if (isValidEmailid) {
        var contactDetails = [myForm.contactFirstName, myForm.contactLastName, myForm.contactEmail, myForm.contactTopic, myForm.contactComment];
        hooksHelper('app.contactUs.subscribe', 'subscribe', contactDetails, function () {});

        res.json({
            success: true,
            msg: Resource.msg('subscribe.to.contact.us.success', 'contactUs', null)
        });
    } else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.to.contact.us.email.invalid', 'contactUs', null)
        });
    }

    next();
});

module.exports = server.exports();
