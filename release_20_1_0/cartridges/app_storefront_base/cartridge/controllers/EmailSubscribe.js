'use strict';
var server = require('server');

/**
 * Checks if the email value entered is correct format
 * @param {string} email - email string to check if valid
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

server.post('Subscribe', function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');

    var email = req.form.emailId;
    var isValidEmailid;
    if (email) {
        isValidEmailid = validateEmail(email);

        if (isValidEmailid) {
            hooksHelper('app.mailingList.subscribe', 'subscribe', [email], function () {});
            res.json({
                success: true,
                msg: Resource.msg('subscribe.email.success', 'homePage', null)
            });
        } else {
            res.json({
                error: true,
                msg: Resource.msg('subscribe.email.invalid', 'homePage', null)
            });
        }
    } else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.email.invalid', 'homePage', null)
        });
    }

    next();
});


module.exports = server.exports();
