// cachedSearch.js
import { LightningElement, track } from 'lwc';
import searchProducts from '@salesforce/apex/ProductController.searchProducts';

// Import cache utilities
import {
    getMemoryCache,
    setMemoryCache,
    getSessionCache,
    setSessionCache,
    getLocalCache,
    setLocalCache,
    setExpiringCache,
    getExpiringCache
} from 'c/cachingUtils';

let debounceTimer;

export default class CachedSearch extends LightningElement {
    @track results = [];
    @track searchKey = '';

    handleInput(event) {
        this.searchKey = event.target.value;

        clearTimeout(debounceTimer);

        // Debounce for 400ms
        debounceTimer = setTimeout(() => {
            this.runSearch(this.searchKey);
        }, 400);
    }

    runSearch(key) {
        if (!key) return;

        console.log('🔍 Searching for:', key);

        // ---------------------------------
        // 1️⃣ Check Memory Cache (Fastest)
        // ---------------------------------
        if (getMemoryCache(key)) {
            console.log('⚡ Memory Cache Hit');
            this.results = getMemoryCache(key);
            return;
        }

        // ---------------------------------
        // 2️⃣ Check Session Storage (tab-level)
        // ---------------------------------
        const sessionData = getSessionCache(key);
        if (sessionData) {
            console.log('🟦 Session Cache Hit');
            this.results = sessionData;
            setMemoryCache(key, sessionData);
            return;
        }

        // ---------------------------------
        // 3️⃣ Check Local Storage (persistent)
        // ---------------------------------
        const localData = getLocalCache(key);
        if (localData) {
            console.log('🟩 Local Cache Hit');
            this.results = localData;
            setMemoryCache(key, localData);
            setSessionCache(key, localData);
            return;
        }

        // ---------------------------------
        // 4️⃣ Check Expiring Cache (TTL)
        // ---------------------------------
        const expireData = getExpiringCache(key);
        if (expireData) {
            console.log('⏳ Expiring Cache Hit');
            this.results = expireData;
            return;
        }

        // ---------------------------------
        // 5️⃣ Cache Miss → Call Apex
        // ---------------------------------
        searchProducts({ searchKey: key })
            .then(data => {
                console.log('☁️ Apex Call Done');

                this.results = data;

                // Save everywhere
                setMemoryCache(key, data);
                setSessionCache(key, data);
                setLocalCache(key, data);

                // TTL cache -> expires in 5 minutes
                setExpiringCache(key, data, 5);
            })
            .catch(err => {
                console.error('❌ Error: ', err);
            });
    }
}
