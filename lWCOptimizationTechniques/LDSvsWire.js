// accountDetailsLDS.js
import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

// Fields you want to fetch
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class AccountDetailsLDS extends LightningElement {
    @api recordId;

    // Fetching the Account using LDS (fastest, cached)
    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD, INDUSTRY_FIELD] })
    account;

    // Getter for account name
    get name() {
        return this.account?.data?.fields?.Name?.value;
    }

    // Getter for industry
    get industry() {
        return this.account?.data?.fields?.Industry?.value;
    }
}
