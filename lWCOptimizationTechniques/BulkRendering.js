// bulkRenderer.js
import { LightningElement, track } from 'lwc';

export default class BulkRenderer extends LightningElement {
    @track visibleItems = [];
    allItems = []; // Loaded from Apex
    batchSize = 30;

    connectedCallback() {
        this.loadInBatches(0);
    }

    loadInBatches(startIndex) {
        const end = startIndex + this.batchSize;
        this.visibleItems = [
            ...this.visibleItems,
            ...this.allItems.slice(startIndex, end)
        ];

        if (end < this.allItems.length) {
            setTimeout(() => {
                this.loadInBatches(end);
            }, 30); // Give browser breathing space
        }
    }
}
