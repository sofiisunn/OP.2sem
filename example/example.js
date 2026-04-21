'use strict';

const { PriorityQueue } = require('../lib/index');

const pq = new PriorityQueue();
pq.enqueue("Task 1", "1");
pq.enqueue("Task 2", "4");
pq.enqueue("Task 3", "2");
pq.enqueue("Task 4", "3");
console.log("Priority Map:");
console.log(pq.priorityMap);
console.log("Order:");
console.log(pq.order);
console.log("Peek highest priority:", pq.peek("highest"));
console.log("Peek lowest priority:", pq.peek("lowest"));
console.log("Peek oldest:", pq.peek("oldest"));
console.log("Peek newest:", pq.peek("newest"));
console.log("Dequeue highest priority:", pq.dequeue("highest"));
console.log("Dequeue lowest priority:", pq.dequeue("lowest"));
console.log("Dequeue oldest:", pq.dequeue("oldest"));
console.log("Dequeue newest:", pq.dequeue("newest"));





