import _ from 'lodash';

export const globalPostalCode = {
    x_default: '01802',
    en_GB: 'SW42 4RG',
    fr_FR: '12345',
    it_IT: '12345',
    ja_JP: '123-1234',
    zh_CN: '123456'
};

export const globalPostalCode2 = {
    x_default: '01705',
    en_GB: 'SW42 4HT',
    fr_FR: '12346',
    it_IT: '12347',
    ja_JP: '123-1235',
    zh_CN: '123457'
};

export const globalCountryCode = {
    x_default: 'us',
    en_GB: 'gb',
    fr_FR: 'fr',
    it_IT: 'it',
    ja_JP: 'jp',
    zh_CN: 'cn'
};

export const globalPhone = {
    x_default: '333-333-3333',
    en_GB: '01222 555 555',
    fr_FR: '01 23 45 67 89',
    it_IT: '02 12345678',
    ja_JP: '01-1234-1234',
    zh_CN: '333-333-3333'
};

export const globalPhone2 = {
    x_default: '333-333-2222',
    en_GB: '01222 555 444',
    fr_FR: '01 23 45 67 88',
    it_IT: '02 12345677',
    ja_JP: '01-1234-1233',
    zh_CN: '333-333-5555'
};

export class Customer {
    constructor(customer) {
        const profile = customer.profile[0];

        this.login = customer.credentials[0].login[0];
        this.salutation = profile.salutation[0];
        this.title = profile.title[0];
        this.firstName = profile['first-name'][0];
        this.lastName = profile['last-name'][0];
        this.suffix = profile.suffix[0];
        this.company = profile['company-name'][0];
        this.jobTitle = profile['job-title'][0];
        this.email = profile.email[0];
        this.phoneHome = profile['phone-home'][0];
        this.phoneWork = profile['phone-business'][0];
        this.phoneMobile = profile['phone-mobile'][0];
        this.fax = profile.fax[0];
        this.gender = profile.gender[0] === '1' ? 'M' : 'F';

        if (Object.hasOwnProperty.call(customer, 'addresses')) {
            this.addresses = parseAddresses(customer.addresses[0].address);
        }
    }

    getPreferredAddress() {
        return _.find(this.addresses, { preferred: true });
    }
}

/**
 * Extracts specific customer from customers array by login value
 *
 * @param {Object} customers - parsedData.customers
 * @param {String} login - Customer's login value
 * @returns {Customer} - customer
 */
export function getCustomer(customers, login) {
    return new Customer(customers[login]);
}

/**
 * Processes parsed JSONified file data and sends back a map of Customers
 *
 * @param {Object} rawCustomers - Parsed data from XML files
 * @returns {Array} - Customer objects
 */
export function parseCustomers(rawCustomers, currentCustomers) {
    let parsedCustomers = currentCustomers || {};

    rawCustomers.customers.customer.forEach(customer => {
        const login = customer.credentials[0].login[0];
        parsedCustomers[login] = customer;
    });

    return parsedCustomers;
}

function parseAddresses(rawAddresses) {
    let addresses = [];

    for (let address of rawAddresses) {
        let proxy = {
            addressId: address.$['address-id'],
            preferred: (address.$.preferred === 'true'),
            salutation: address.salutation[0],
            title: address.title[0],
            firstName: address['first-name'][0],
            secondName: address['second-name'][0],
            lastName: address['last-name'][0],
            suffix: address.suffix[0],
            companyName: address['company-name'][0],
            jobTitle: address['job-title'][0],
            address1: address.address1[0],
            address2: address.address2[0],
            suite: address.suite[0],
            postbox: address.postbox[0],
            city: address.city[0],
            postalCode: address['postal-code'][0],
            stateCode: address['state-code'][0],
            countryCode: address['country-code'][0],
            phone: address.phone[0]
        };

        addresses.push(proxy);
    }

    return addresses;
}
