'use strict';

export class PriorityQueue {
    constructor() {
        this.priorityMap = new Map();
        this.order = [];
    }

    enqueue(item, priority) {
        priority = Number(priority);
        const object = {value: item, priority: priority, index: this.order.length};
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
           const oldest = this.order.shift();
           let arr = this.priorityMap.get(oldest.priority);
           arr.shift();
           if(arr.length === 0) {
                this.priorityMap.delete(oldest.priority);
            }
            for(let i = 0; i < this.order.length; i++) {
                this.order[i].index = i;
            }
            return oldest;
        } 
        if(type === 'newest') {
            const newest = this.order.pop(); 
            let arr = this.priorityMap.get(newest.priority);
            arr.pop();
            if(arr.length === 0) {
                this.priorityMap.delete(newest.priority);
            }
            for(let i = 0; i < this.order.length; i++) {
                this.order[i].index = i;
            }
            return newest;
        } 
        if(type === 'highest') {
            let keys = Array.from(this.priorityMap.keys());
            let max = Math.max(...keys);
            let arr = this.priorityMap.get(max);
            const highest = arr[0];
            arr.shift();
            this.order.splice(highest.index, 1);
            for(let i = 0; i < this.order.length; i++) {
                this.order[i].index = i;
            }
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
            arr.shift();
            this.order.splice(lowest.index, 1);
            for(let i = 0; i < this.order.length; i++) {
                this.order[i].index = i;
            }
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


