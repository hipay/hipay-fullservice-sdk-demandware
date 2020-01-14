'use strict';

/**
 * Returns a value of the first element in the array that satisfies the provided testing function.
 * Otherwise undefined is returned.
 * @param {Array} array - Array of elements to find the match in.
 * @param {Array} matcher - function that returns true if match is found
 * @return {Object|undefined} element that matches provided testing function or undefined.
 */
function find(array, matcher) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (matcher(array[i], i)) {
            return array[i];
        }
    }

    return undefined;
}

module.exports = {
    find: find
};
