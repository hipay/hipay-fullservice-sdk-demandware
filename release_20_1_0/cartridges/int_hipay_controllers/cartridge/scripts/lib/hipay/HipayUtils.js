function removeAccents(str) {
    var r = str.toLowerCase();
    r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
    r = r.replace(new RegExp("æ", 'g'),"ae");
    r = r.replace(new RegExp("ç", 'g'),"c");
    r = r.replace(new RegExp("[èéêë]", 'g'),"e");
    r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
    r = r.replace(new RegExp("ñ", 'g'),"n");
    r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
    r = r.replace(new RegExp("œ", 'g'),"oe");
    r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
    r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
    return r;
}

function normalizeString(str) {
    if(typeof str !== 'string'){
        return str;
    }

    var normalizedStr;

    normalizedStr = removeAccents(str);
    normalizedStr = normalizedStr
        .trim()
        .replace(/-/g, ' ')
        .replace(/'/g, ' ')
        .toUpperCase();

    return normalizedStr;
}

function compareStrings(str1, str2) {
    return normalizeString(str1) === normalizeString(str2);
}

function compareNames(firstname1, lastname1, firstname2, lastname2) {
    // Normalize strings
    var name1 = normalizeString(firstname1) + ' ' + normalizeString(lastname1);
    var name2 = normalizeString(firstname2) + ' ' + normalizeString(lastname2);
    var inversedName2 = normalizeString(lastname2) + ' ' + normalizeString(firstname2);

    // Same if name1 equals name2 or inversed firstnames and lastnames
    return (name1 === name2) || (name1 === inversedName2);
}

/**
 * Use this method to remove time stamp form orderId.
 *
 * @param string str: orderId with time
 * @returns only orderId 
 */
function removeFromOrderId(str) {
    var orderidTab = str.split("_");
    orderidTab.pop();

    return orderidTab.join("_");
}

module.exports = {
    compareStrings: compareStrings,
    compareNames: compareNames,
    removeFromOrderId: removeFromOrderId
};
