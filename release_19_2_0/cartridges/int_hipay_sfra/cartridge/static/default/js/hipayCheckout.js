const hipay = HiPay({
    username: 'public',
    password: 'password'
});

let browserInfo = hipay.getBrowserInfo();

$('#browserInfo').val(JSON.stringify(browserInfo));
