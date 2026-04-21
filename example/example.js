'use strict';

const { PriorityQueue, TodoApp, asyncMapCallback, asyncMap } = require('../lib/index');

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

const todo = new TodoApp();
todo.addTask();
todo.addTask();
todo.addTask();
console.log("All tasks:");
for (const task of todo.tasks.values()) {
    console.log(task);
}
const current = todo.getTask();
console.log("Current task:");
console.log(
    "ID:", current.taskId,
    " Title:", current.title,
    " Color:", current.color,
    " Status:", current.status,
    " Priority:", current.priority
);
const removed = todo.removeTask();
console.log("Removed task:");
console.log(
    "ID:", removed.taskId,
    " Title:", removed.title,
    " Color:", removed.color,
    " Status:", removed.status,
    " Priority:", removed.priority
);
todo.processTasks()
.then(result => {
    console.log("Processed tasks:");
    for (const task of result) {
        console.log(
            "ID:", task.taskId,
            " Title:", task.title,
            " Color:", task.color,
            " Status:", task.status,
            " Priority:", task.priority
        );
    }
})
.catch(error => {
    console.error("Error processing tasks:", error);
});

console.log("Callback example:");
const tasksCallback  = Array.from(todo.tasks.values());
asyncMapCallback(tasksCallback, (task, callback) => {
    task.status = "done";
    callback(task);
}, (err, result) => {
    if (err) {
        console.error("Error processing tasks:", err);
        return;
    }
    else {
        console.log("Callback result:");
        console.log(result);
    }   
})

console.log("Async/Await example:");
async function run() {
    const result = await asyncMap(Array.from(todo.tasks.values()), (task) => {
        task.status = "done";
        return task;
    });
    console.log(result);
}
run();