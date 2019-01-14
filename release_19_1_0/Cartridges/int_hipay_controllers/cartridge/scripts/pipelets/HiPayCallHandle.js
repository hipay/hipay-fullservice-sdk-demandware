/**
* @input ProcessorID : String
* @input PaymentMethodID : String
* @input Cart : dw.order.Basket
*/

function execute(args) {
    var Cart           = args.Cart,
        ProcessorID    = args.ProcessorID,
        PaymentMethod  = args.PaymentMethodID,
        extensionPoint = 'app.payment.processor.' + ProcessorID;

    if (dw.system.HookMgr.hasHook(extensionPoint)) {
        var response = dw.system.HookMgr.callHook(extensionPoint, 'Handle', {
            Basket          : args.Cart,
            PaymentMethodID : args.PaymentMethodID
        });

        if (response.error) {
            return PIPELET_ERROR;
        }
    } else {
        return PIPELET_ERROR;
    }

    return PIPELET_NEXT;
}
