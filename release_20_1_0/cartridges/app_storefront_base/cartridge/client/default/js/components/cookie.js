'use strict';

/**
 * Get cookie value by cookie name from browser
 * @param {string} cookieName - name of the cookie
 * @returns {string} cookie value of the found cookie name
 */
function getCookie(cookieName) {
    var name = cookieName + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookieItem = cookieArray[i];
        while (cookieItem.charAt(0) === ' ') {
            cookieItem = cookieItem.substring(1);
        }
        if (cookieItem.indexOf(name) === 0) {
            return cookieItem.substring(name.length, cookieItem.length);
        }
    }
    return '';
}

module.exports = function () {
    if ($('.valid-cookie-warning').length > 0) {
        var previousSessionID = window.localStorage.getItem('previousSid');
        var currentSessionID = getCookie('sid');
        if (!previousSessionID && currentSessionID) {
            // When a user first time visit the home page,
            // set the previousSessionID to currentSessionID
            // and Show the cookie alert
            previousSessionID = currentSessionID;
            window.localStorage.setItem('previousSid', previousSessionID);
            $('.cookie-warning-messaging').show();
        } else if (previousSessionID && previousSessionID === currentSessionID) {
            // Hide the cookie alert if user is in the same session
            $('.cookie-warning-messaging').hide();
        } else {
            // Clear the previousSessionID from localStorage
            // when user session is changed or expired
            previousSessionID = '';
            window.localStorage.removeItem('previousSid');
        }
    }
};
