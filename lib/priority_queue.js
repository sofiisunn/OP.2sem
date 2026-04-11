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
        if(type === 'highest') {
            let keys = Array.from(this.priorityMap.keys());
            let max = Math.max(...keys);
            return this.priorityMap.get(max)[0];
        }
        if(type === 'lowest') {
            let keys = Array.from(this.priorityMap.keys());
            let min = Math.min(...keys);
            return this.priorityMap.get(min)[0];
        }
        else {
            return null;
        }
    }
    dequeue(type) { 
        if(this.order.length === 0) {
            return null; 
        } 
        if(type === 'oldest') {
           const oldest = this.order[0];
           this.order.splice(0, 1);
           let arr = this.priorityMap.get(oldest.priority);
           let index = arr.indexOf(oldest);
           arr.splice(index, 1);
           if(arr.length === 0) {
                this.priorityMap.delete(oldest.priority);
            }
            return oldest;
        } 
        if(type === 'newest') {
            const newest = this.order[this.order.length - 1]; 
            this.order.splice(this.order.length - 1, 1);
            let arr = this.priorityMap.get(newest.priority);
            let index = arr.indexOf(newest);
            arr.splice(index, 1);
            if(arr.length === 0) {
                this.priorityMap.delete(newest.priority);
            }
            return newest;
        } 
        if(type === 'highest') {
            let keys = Array.from(this.priorityMap.keys());
            let max = Math.max(...keys);
            let arr = this.priorityMap.get(max);
            const highest = arr[0];
            this.order.splice(this.order.indexOf(highest), 1);
            arr.splice(0, 1);
            if(arr.length === 0) {
                this.priorityMap.delete(max);
            }
            return highest;
        }
        if(type === 'lowest') {
            let keys = Array.from(this.priorityMap.keys());
            let min = Math.min(...keys);
            let arr = this.priorityMap.get(min);
            const lowest = arr[0];
            this.order.splice(this.order.indexOf(lowest), 1);
            arr.splice(0, 1);
            if(arr.length === 0) {
                this.priorityMap.delete(min);
            }
            return lowest;
        }
        else {
            return null;
        }
    }
}

module.exports = { PriorityQueue };
