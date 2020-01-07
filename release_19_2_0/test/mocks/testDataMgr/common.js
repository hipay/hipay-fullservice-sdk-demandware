'use strict';

export class AbstractDwModelMock {
    toString() {
        return JSON.stringify(this);
    }

    /**
     * If get localized product property exists then return localized product property
     * else return default product property
     * @param {String} propertyPath - dot notation property path (i.e., for a variation master product, 'pageAttributes.pageTitle')
     * @param {String} [locale] - Locale code (i.e., fr_FR or zh_CN)
     * @returns {String}
     */
    getLocalizedProperty(propertyPath, locale = 'x_default') {
        let tokens = propertyPath.split('.');
        let property = tokens.reduce((product, token) => product[token], this);
        let keys = Object.keys(property);
        let parsedLocale = keys.indexOf(locale) > -1 ? locale : 'x_default';
        return property[parsedLocale];
    }
}

export function parseLocalizedValues(values) {
    let result = {};

    values.forEach(value => {
        let key = value.$['xml:lang'].replace('-', '_');
        result[key] = value._;
    });

    return result;
}

