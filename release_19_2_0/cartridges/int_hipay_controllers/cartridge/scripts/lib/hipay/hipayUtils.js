function normalizeString(str){
    // Replace - and ' by spaces and uppercase
    if(typeof str === 'string'){
        return str
            .replace(/-/g, ' ')
            .replace(/'/g, ' ')
            .toUpperCase();
    } else {
        return str;
    }
}

function compareStrings(str1, str2){
    return normalizeString(str1) === normalizeString(str2);
}

module.exports = {
    compareStrings: compareStrings
};
