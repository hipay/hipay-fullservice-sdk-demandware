'use strict';

var csrfProtection = require('dw/web/CSRFProtection');
var CustomerMgr = require('dw/customer/CustomerMgr');
var URLUtils = require('dw/web/URLUtils');

/**
 * Middleware validating CSRF token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function validateRequest(req, res, next) {
    if (!csrfProtection.validateRequest()) {
        CustomerMgr.logoutCustomer(false);
        res.redirect(URLUtils.url('CSRF-Fail'));
    }

    next();
}

/**
 * Middleware validating CSRF token from ajax request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function validateAjaxRequest(req, res, next) {
    if (!csrfProtection.validateRequest()) {
        CustomerMgr.logoutCustomer(false);
        res.redirect(URLUtils.url('CSRF-AjaxFail'));
    }

    next();
}

/**
 * Middleware generating a csrf token and setting the view data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function generateToken(req, res, next) {
    res.setViewData({ csrf: {
        tokenName: csrfProtection.getTokenName(), token: csrfProtection.generateToken() } });

    next();
}

module.exports = {
    validateRequest: validateRequest,
    validateAjaxRequest: validateAjaxRequest,
    generateToken: generateToken
};
