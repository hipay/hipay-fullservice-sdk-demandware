/* eslint-disable no-undef */
const hipay = HiPay({
    username: 'test',
    password: 'test'
});

let browserInfo = hipay.getBrowserInfo();

// eslint-disable-next-line no-undef
$('#browserInfo').val(JSON.stringify(browserInfo));
