/**
* @input CountryCode : String The country code.
* @input PaymentAmount : Number The payment amount.
* @output ValidPaymentInstruments : dw.util.Collection The collection of valid payment instruments.
*/

function execute(args) {
    var countryCode = args.CountryCode,
        paymentAmount = args.PaymentAmount;

    args.ValidPaymentInstruments = require('*/cartridge/scripts/lib/hipay/HiPayCheckoutModule').getApplicableCreditCards(countryCode, paymentAmount).ValidPaymentInstruments;

    return PIPELET_NEXT;
}
