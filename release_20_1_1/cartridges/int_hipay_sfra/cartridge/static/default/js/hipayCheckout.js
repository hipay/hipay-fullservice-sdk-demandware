const hipay = HiPay({
    username: 'test',
    password: 'test'
});

let browserInfo = hipay.getBrowserInfo();

$('#browserInfo').val(JSON.stringify(browserInfo));
