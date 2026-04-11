'use strict';

class PriorityQueue {
    constructor() {
        this.priorityMap = new Map();
        this.order = [];
    }

    enqueue(item, priority) {
        priority = Number(priority);
        const object = {value: item, priority: priority};
        if(!this.priorityMap.has(priority)) {
            this.priorityMap.set(priority, []);
        }
        this.priorityMap.get(priority).push(object);
        this.order.push(object);
    }
    peek(type) { 
        if(this.order.length === 0) {
             return null; 
        } 
        if(type === 'oldest') {
             return this.order[0];
        } 
        if(type === 'newest') {
             return this.order[this.order.length - 1]; 
        } 
        let keys = Array.from(this.priorityMap.keys());
        if(type === 'highest') {
            let max = Math.max(...keys);
            return this.priorityMap.get(max)[0];
        }
        if(type === 'lowest') {
            let min = Math.min(...keys);
            return this.priorityMap.get(min)[0];
        }
        else {
            return null;
        }
    }
}

module.exports = { PriorityQueue };
