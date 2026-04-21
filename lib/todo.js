'use strict';

const { generator } = require('./generator'); 
const { Task } = require('./task');
const { PriorityQueue } = require('./priority_queue');
const { asyncMap, asyncMapCallback } = require('./asyncMap');

class TodoApp {
    constructor() {
    this.generator = generator();
    this.queue = new PriorityQueue();
    this.tasks = new Map();
    this.controller = new AbortController();
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
    processTasks() {
        const taskArray = Array.from(this.tasks.values());
        return asyncMap(taskArray, (task) => {
            const updatedTask = Object.assign({}, task);
            updatedTask.status = "done";
            return updatedTask;
        }, this.controller.signal);
    }
    stopProcessing() {
        this.controller.abort();
        this.controller = new AbortController();
    }
}

module.exports = { TodoApp };  