'use strict';

const lib = require('lab2-op');
const gen = lib.generator();
const PriorityQueue = lib.PriorityQueue;
const Task = lib.Task;

class TodoApp {
    constructor() {
    this.generator = gen;
    this.queue = new PriorityQueue();
    }
    addTask() {
    const value = this.generator.next().value;
    const id = value.taskId;
    const color = value.color;
    const task = new Task(id, "Task " + id, color, 1);
    this.queue.enqueue(task, task.priority);
    }
    getTask() {
        if(this.queue.order.length === 0) {
            return null;
        }
        return this.queue.peek('highest');
    }
    removeTask() {
        if(this.queue.order.length === 0) {
            return null;
        }
        return this.queue.dequeue('highest');
    }
}

module.exports = { TodoApp };