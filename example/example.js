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