'use strict';

const lib = require('lab2-op');

const gen = lib.generator();
const tasks = [];
const priority = ["low", "medium", "high"];


for(let i = 0; i < 10; i++) {
    const value = gen.next().value;
    let currentPriority = priority[i % priority.length];
    const task = new lib.Task(value.taskId, "Task " + value.taskId, value.color, currentPriority);
    tasks.push(task);
}

for(const task of tasks) {
    console.log(task.taskId, task.title, task.color, task.status, task.createdAt, task.priority);
}

function sum(a, b) {
    console.log("Обчислення суми..."); 
    return a + b;
} 
const memoSum = lib.memoize(sum, 2, 3000);
console.log("LRU: ");
console.log(memoSum(1,2)); 
console.log(memoSum(2,3)); 
console.log(memoSum(1,2)); 
console.log(memoSum(4,5)); 
console.log(memoSum(2,3));
console.log(memoSum(1,2)); 
setTimeout(() => {
    console.log("TTL: ");
    console.log(memoSum(1, 2));
}, 4000);

const PriorityQueue = lib.PriorityQueue;
const pq = new PriorityQueue();
pq.enqueue("Task 1", "1");
pq.enqueue("Task 2", "3");
pq.enqueue("Task 3", "2");
console.log("Priority Map:");
console.log(pq.priorityMap);
console.log("Order:");
console.log(pq.order);
console.log("Peek highest priority:");
console.log(pq.peek("highest"));
console.log("Peek lowest priority:");
console.log(pq.peek("lowest"));
console.log("Peek oldest:");
console.log(pq.peek("oldest"));
console.log("Peek newest:");
console.log(pq.peek("newest"));


