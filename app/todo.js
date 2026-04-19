'use strict';

const lib = require('lab2-op');
const gen = lib.generator();
const PriorityQueue = lib.PriorityQueue;
const Task = lib.Task;

class TodoApp {
    constructor() {
    this.generator = gen;
    this.queue = new PriorityQueue();
    this.tasks = new Map();
    }
    addTask() {
    const value = this.generator.next().value;
    const id = value.taskId;
    const color = value.color;
    const task = new Task(id, "Task " + id, color, 1);
    this.queue.enqueue(task, task.priority);
    this.tasks.set(task.taskId, task);
    }
    getTask() {
        if(this.queue.order.length === 0) {
            return null;
        }
        const task = this.queue.peek('highest');
        return task;
    }
    removeTask() {
        if(this.queue.order.length === 0) {
            return null;
        }
        const task = this.queue.dequeue('highest');
        this.tasks.delete(task.taskId);
        return task;
    }
}

module.exports = { TodoApp };