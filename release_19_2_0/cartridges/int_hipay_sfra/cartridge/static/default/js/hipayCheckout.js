const hipay = HiPay({
    username: 'test',
    password: 'test'
});

let browserInfo = hipay.getBrowserInfo();
console.log(browserInfo);

$('#browserInfo').val(JSON.stringify(browserInfo));
