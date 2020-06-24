/**
* @input ProcessorID : String
* @input PaymentMethodID : String
* @input Order : dw.order.Order
* @input PaymentInstrument : dw.order.PaymentInstrument
* @output AuthorizationResult : Object
*/

// eslint-disable-next-line no-unused-vars
function execute(args) {
    var order = args.Order,
        paymentInstrument = args.PaymentInstrument,
        extensionPoint = 'app.payment.processor.' + args.ProcessorID;

    if (dw.system.HookMgr.hasHook(extensionPoint)) {
        var response = dw.system.HookMgr.callHook(extensionPoint, 'Authorize', {
            Order: order,
            OrderNo: order.getOrderNo(),
            PaymentInstrument: paymentInstrument
        });

        args.AuthorizationResult = response;

        if (response.error) {
            return PIPELET_ERROR;
        }
    } else {
        return PIPELET_ERROR;
    }

    return PIPELET_NEXT;
}
