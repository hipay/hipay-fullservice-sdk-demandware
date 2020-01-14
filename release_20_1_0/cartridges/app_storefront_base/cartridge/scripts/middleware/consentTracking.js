'use strict';

/**
 * Middleware to use consent tracking check
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function consent(req, res, next) {
    var consented = req.session.privacyCache.get('consent');
    if (consented === null || consented === undefined) {
        req.session.privacyCache.set('consent', null);
    } else if (consented === false) {
        req.session.privacyCache.set('consent', false);
        req.session.raw.setTrackingAllowed(false);
    } else if (consented === true) {
        req.session.privacyCache.set('consent', true);
        req.session.raw.setTrackingAllowed(true);
    }

    res.setViewData({
        tracking_consent: req.session.privacyCache.get('consent')
    });
    next();
}

module.exports = {
    consent: consent
};
