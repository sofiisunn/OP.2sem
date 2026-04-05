'use strict';

class PriorityQueue {
    constructor() {
        this.priorityMap = new Map();
        this.order = [];
    }

    enqueue(item, priority) {
        const object = {value: item, priority: priority};
        if(!this.priorityMap.has(priority)) {
            this.priorityMap.set(priority, []);
        }
        this.priorityMap.get(priority).push(object);
        this.order.push(object);
    }
}

module.exports = { PriorityQueue };
