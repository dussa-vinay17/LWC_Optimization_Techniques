// debounceSearch.js
import { LightningElement, track } from 'lwc';
import searchProducts from '@salesforce/apex/ProductController.searchProducts';

let debounceTimer;

export default class DebounceSearch extends LightningElement {
    @track results = [];

    handleInput(event) {
        const query = event.target.value;

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            this.runSearch(query);
        }, 500); // 0.5 sec debounce
    }

    runSearch(value) {
        searchProducts({ searchKey: value })
            .then(res => {
                this.results = res;
            })
            .catch(err => {
                console.error(err);
            });
    }
}
