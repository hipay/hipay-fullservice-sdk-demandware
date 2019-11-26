var assert = require('chai').assert;
var hipayUtils = require('../../../../../../cartridges/int_hipay_sfra/cartridge/scripts/lib/hipay/hipayUtils.js');

describe ('hipayUtils', function () {
    describe ('removeAccents', function () {
        it ('Should remove accents', function() {
            assert.equal(hipayUtils.removeAccents('ééééé'), 'eeeee');
            assert.equal(hipayUtils.removeAccents('ààààà'), 'aaaaa');
            assert.equal(hipayUtils.removeAccents('ôôôôô'), 'ooooo');
            assert.equal(hipayUtils.removeAccents('îéaéô'), 'ieaeo');
            assert.equal(hipayUtils.removeAccents('ABCDè'), 'abcde');
        });

        it ('Should return same string', function() {
            assert.equal(hipayUtils.removeAccents('eeeee'), 'eeeee');
            assert.equal(hipayUtils.removeAccents('aaaaa'), 'aaaaa');
            assert.equal(hipayUtils.removeAccents('ooooo'), 'ooooo');
            assert.equal(hipayUtils.removeAccents('iiiii'), 'iiiii');
        });
    });

    describe ('normalizeString', function () {
        it ('Should return same element', function() {
            assert.equal(hipayUtils.normalizeString(123), 123);
            assert.equal(hipayUtils.normalizeString('123'), '123');
        });

        it ('Should return normalized element', function() {
            assert.equal(hipayUtils.normalizeString('ééééé'), 'EEEEE');
            assert.equal(hipayUtils.normalizeString('  abcde  '), 'ABCDE');
            assert.equal(hipayUtils.normalizeString('ab-cd'), 'AB CD');
            assert.equal(hipayUtils.normalizeString('ab\'cd'), 'AB CD');
            assert.equal(hipayUtils.normalizeString('   àb-c\'dé   '), 'AB C DE');
        });
    });

    describe ('compareStrings', function () {
        it ('Should return true', function() {
            assert.isTrue(hipayUtils.compareStrings('ABCDE', 'abcde'));
            assert.isTrue(hipayUtils.compareStrings('ééééé', 'eeeee'));
            assert.isTrue(hipayUtils.compareStrings('à-b-c-d-é', 'a b c d e'));
            assert.isTrue(hipayUtils.compareStrings('ààààà', 'AAAAA'));
            assert.isTrue(hipayUtils.compareStrings('  à-b\'cDé ', 'a b CdE'));
            assert.isTrue(hipayUtils.compareStrings('1 rue de Paris', '     1 Rue dé PARIS    '));
        });

        it ('Should return false', function() {
            assert.isFalse(hipayUtils.compareStrings('1 rue de Paris', '10 rue de Paris'));
            assert.isFalse(hipayUtils.compareStrings('Paris', 'Paris Cedex'));
            assert.isFalse(hipayUtils.compareStrings('1 rue       de Paris', '1 rue de Paris'));
        });
    });

    describe ('compareNames', function () {
        it ('Should return true', function() {
            assert.isTrue(hipayUtils.compareNames('John', 'Doe', 'John', 'Doe'));
            assert.isTrue(hipayUtils.compareNames('John', 'Doe', 'Doe', 'John'));
            assert.isTrue(hipayUtils.compareNames('JOHN', 'DOE', 'John', 'Doe'));
            assert.isTrue(hipayUtils.compareNames('John', 'Doe', '  JoHN  ', 'DOE   '));
            assert.isTrue(hipayUtils.compareNames('Jean-Paul', 'Doe', 'Jean Paul', 'Doe'));
            assert.isTrue(hipayUtils.compareNames('Mélissa', 'Doe', 'MELISSA', 'DOE'));
            assert.isTrue(hipayUtils.compareNames('José-Bernard', 'De La Villardière', 'José-Bernard', 'De La Villardière'));
            assert.isTrue(hipayUtils.compareNames('José-Bernard', 'De La Villardière', 'de La Villardiere', 'José Bernard'));
            assert.isTrue(hipayUtils.compareNames('De La Villardière', 'José-Bernard', 'José Bernard ', 'de La Villardiere'));
        });

        it ('Should return false', function() {
            assert.isFalse(hipayUtils.compareNames('John', 'Doe', 'Johnny', 'Doe'));
            assert.isFalse(hipayUtils.compareNames('John', 'Doe', 'John', 'Did'));
            assert.isFalse(hipayUtils.compareNames('José-Bernard', 'De La Villardière', 'José-Bernard', 'Villardière'));
            assert.isFalse(hipayUtils.compareNames('José-Bernard', 'De La Villardière', 'José', 'De La Villardière'));
        });
    });

    describe ('removeFromOrderId', function () {   
        var orderidOne = 'SG01_00009801_1574781117343';
        var expected_orderidOne = 'SG01_00009801';
        var orderidTwo = 'NIJI_01_00009801_1234745117890';  
        var expected_orderidTwo = 'NIJI_01_00009801';     

        it ('should return true when remove time-stamp from orderId (even if there are several underscore)', function() {            
            assert.equal(hipayUtils.removeFromOrderId(orderidOne), expected_orderidOne);
            assert.equal(hipayUtils.removeFromOrderId(orderidTwo), expected_orderidTwo);
        });        
    });
});