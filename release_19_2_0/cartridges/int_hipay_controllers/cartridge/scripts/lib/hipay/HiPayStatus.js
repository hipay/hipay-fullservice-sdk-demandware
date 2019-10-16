/**
 * HiPayStatus object contains all status response types
 */
var HiPayStatus = {
    // payment state
    COMPLETED: {
        code: 'completed',
        value: 'COMPLETED'
    },
    FORWARDING: {
        code: 'forwarding',
        value: 'FORWARDING'
    },
    PENDING: {
        code: 'pending',
        value: 'PENDING'
    },
    DECLINED: {
        code: 'declined',
        value: 'DECLINED'
    },
    ERROR: {
        code: 'error',
        value: 'ERROR'
    },
    // payment status
    CREATED: {
        code: '101',
        value: 'Created',
        description: 'The payment attempt was created.'
    },
    CARDHOLDER_ENROLLED: {
        code: '103',
        value: 'Cardholder Enrolled',
        description: 'Card is enrolled in the 3-D Secure program. The merchant has to forward the cardholder to the authentication pages of the card issuer.'
    },
    CARDHOLDER_NOT_ENROLLED: {
        code: '104',
        value: 'Cardholder Not Enrolled',
        description: 'Card is not enrolled in 3-D Secure program.'
    },
    UNABLE_TO_AUTHENTICATE: {
        code: '105',
        value: 'Unable to Authenticate',
        description: 'Unable to complete the authentication request.'
    },
    CARDHOLDER_AUTHENTICATED: {
        code: '106',
        value: 'Cardholder Authenticated',
        description: 'Cardholder was successfully authenticated in the 3-D Secure program.'
    },
    AUTHENTICATION_ATTEMPTED: {
        code: '107',
        value: 'Authentication Attempted',
        description: 'The Merchant has attempted to authenticate the cardholder in the 3-D Secure program and either the Issuer or cardholder is not enrolled.'
    },
    COULD_NOT_AUTHENTICATE: {
        code: '108',
        value: 'Could Not Authenticate',
        description: 'The Issuer is not able to complete the authentication request.'
    },
    AUTHENTICATION_FAILED: {
        code: '109',
        value: 'Authentication Failed',
        description: 'Cardholder authentication failed. Authorization request should not be submitted. An authentication failure may be a possible indication of a fraudulent user.'
    },
    BLOCKED: {
        code: '110',
        value: 'Blocked',
        description: 'The transaction has been rejected for reasons of suspected fraud.'
    },
    DENIED: {
        code: '111',
        value: 'Denied',
        description: 'Merchant denied the payment attempt. After reviewing the fraud screening result, the merchant decided to decline the payment.'
    },
    AUTHORIZED_AND_PENDING: {
        code: '112',
        value: 'Authorized and Pending',
        description: 'The payment was challenged by the fraud rule set and is pending.'
    },
    REFUSED: {
        code: '113',
        value: 'Refused',
        description: 'The financial institution refused to authorize the payment. The refusal reasons can be : an exceeded credit limit, an incorrect expiry date, insufficient balance, or many other depending on the selected payment method.'
    },
    EXPIRED: {
        code: '114',
        value: 'Expired',
        description: 'The validity period of the payment authorization has expired. This happens when no capture request is submitted for an authorized payment typically within 7 days after authorization. Note : Depending on the customer\'s issuing bank, the authorization validity period may last from 1-5 days for a debit card and up to 30 days for a credit card.'
    },
    CANCELLED: {
        code: '115',
        value: 'Cancelled',
        description: 'Merchant cancelled the payment attempt. You can only cancel payments with status "Authorized" and that have not yet reached the status "Captured". In the case of a credit card payment, cancelling the transaction consists in voiding the authorization.'
    },
    AUTHORIZED: {
        code: '116',
        value: 'Authorized',
        description: 'The financial institution has approved the payment. In the case of a credit card payment, funds are "held" and deducted from the customer\'s credit limit (or bank balance, in the case of a debit card) but are not yet transferred to the merchant. In the case of bank transfers and some other payment methods, the payment immediately obtains the status "Captured" after being set to "Authorized".'
    },
    CAPTURE_REQUESTED: {
        code: '117',
        value: 'Capture Requested',
        description: 'A capture request has been sent to the financial institution.'
    },
    CAPTURED: {
        code: '118',
        value: 'Captured',
        description: 'The financial institution has processed the payment. The funds will be transferred to HiPay TPP before being settled to your bank account. Authorized payments can be captured as long as the authorization has not expired. Some payment methods, like bank transfers or direct debits, reach the "Captured" status straight away after being authorized.'
    },
    PARTIALLY_CAPTURED: {
        code: '119',
        value: 'Partially Captured',
        description: 'The financial institution has processed part of the payment. If only part of the order can be shipped, it is allowed to capture an amount equal to the shipped part of the order. This is called a partial capture. Note : Remember! As all credit card companies dictate, it is not allowed for a merchant to capture a payment before shipping has completed. Merchant should start shipping the order once the status "Authorized" is reached!'
    },
    COLLECTED: {
        code: '120',
        value: 'Collected',
        description: 'The funds have been made available for remittance to the merchant. A payment with the status \'Collected\' is ready to be paid out. HiPay TPP either will transfer the amount to your bank account within the next few days (depends on your settlement frequency), or the amount is already transferred to your bank account.'
    },
    PARTIALLY_COLLECTED: {
        code: '121',
        value: 'Partially Collected',
        description: 'A part of the transaction has been collected.'
    },
    SETTLED: {
        code: '122',
        value: 'Settled',
        description: 'The financial operations linked to this transaction are closed. Funds have been debited or credited from your merchant account at Hipay.'
    },
    PARTIALLY_SETTLED: {
        code: '123',
        value: 'Partially Settled',
        description: 'A part of the financial operations linked to this transaction is closed.'
    },
    REFUND_REQUESTED: {
        code: '124',
        value: 'Refund Requested',
        description: 'A refund request has been sent to the financial institution.'
    },
    REFUNDED: {
        code: '125',
        value: 'Refunded',
        description: 'The payment was refunded. A payment obtains the status \'Refunded\' when the financial institution processed the refund and the amount has been transferred to the shopper\'s account. The amount will be deducted from the next total amount, to be paid out to the merchant.'
    },
    PARTIALLY_REFUNDED: {
        code: '126',
        value: 'Partially Refunded',
        description: 'A part of the transaction has been refunded.'
    },
    CHARGED_BACK: {
        code: '129',
        value: 'Charged Back',
        description: 'The cardholder reversed a capture processed by their bank or credit card company. For instance, the cardholder contacts his credit card company and denies having made the transaction. The credit card company then revokes the already captured payment. Please note the legal difference between the shopper (who ordered the goods) and the cardholder (who owns the credit card and ends up paying for the order). In general, charge backs only occurs incidentally. When they do, a contact with the shopper can often solve the situation. Occasionally it is an indication of credit card fraud.'
    },
    DEBITED: {
        code: '131',
        value: 'Debited',
        description: 'The acquirer has informed us that a debit linked to the transaction is going to be applied.'
    },
    PARTIALLY_DEBITED: {
        code: '132',
        value: 'Partially Debited',
        description: 'The acquirer has informed us that a partial debit linked to the transaction is going to be applied.'
    },
    AUTHENTICATION_REQUESTED: {
        code: '140',
        value: 'Authentication Requested',
        description: 'The payment method used requires authentication, authentication request was send and system is waiting for a customers’ action.'
    },
    AUTHENTICATED: {
        code: '141',
        value: 'Authenticated',
        description: 'The payment method used requires authentication and it was successfull.'
    },
    AUTHORIZATION: {
        code: '142',
        value: 'Authorization',
        description: 'Requested The payment method used requires an authorization request; the request was send and the system is waiting for the financial institution approval.'
    },
    ACQUIRER_FOUND: {
        code: '150',
        value: 'Acquirer Found',
        description: 'The acquirer payment route has been found.'
    },
    ACQUIRER_NOT_FOUND: {
        code: '151',
        value: 'Acquirer not Found',
        description: 'The acquirer payment route has not been found.'
    },
    CARDHOLDER_ENROLLMENT_UNKNOWN: {
        code: '160',
        value: 'Cardholder Enrollment Unknown',
        description: 'Unable to verify if the card is enrolled in the 3-D Secure program.'
    },
    RISK_ACCEPTED: {
        code: '161',
        value: 'Risk Accepted',
        description: 'The payment has been accepted by the fraud rule set.'
    },
    AUTHORIZATION_REFUSED: {
        code: '163',
        value: 'Authorization Refused',
        description: 'The authorization was refused by the financial institution.'
    },
    CAPTURE_REFUSED: {
        code: '173',
        value: 'Capture Refused',
        description: 'The capture was refused by the financial institution.'
    },
    PENDING_PAYMENT: {
        code: '200',
        value: 'Pending Payment',
        description: 'The transaction request was submitted to the acquirer but response is not yet available.'
    }
};

Object.freeze(HiPayStatus);
module.exports.HiPayStatus = HiPayStatus;
