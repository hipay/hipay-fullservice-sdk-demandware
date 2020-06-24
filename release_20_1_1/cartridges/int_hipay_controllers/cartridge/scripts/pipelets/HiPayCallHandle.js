/**
* @input ProcessorID : String
* @input PaymentMethodID : String
* @input Cart : dw.order.Basket
*/

// eslint-disable-next-line no-unused-vars
function execute(args) {
    var ProcessorID = args.ProcessorID,
        extensionPoint = 'app.payment.processor.' + ProcessorID;

    if (dw.system.HookMgr.hasHook(extensionPoint)) {
        var response = dw.system.HookMgr.callHook(extensionPoint, 'Handle', {
            Basket: args.Cart,
            PaymentMethodID: args.PaymentMethodID
        });

        if (response.error) {
            return PIPELET_ERROR;
        }
    } else {
        return PIPELET_ERROR;
    }

    return PIPELET_NEXT;
}
