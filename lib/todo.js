'use strict';

import { generator } from './generator.js';
import { Task } from './task.js';
import { PriorityQueue } from './priority_queue.js';
import { asyncMap, asyncMapCallback } from './asyncMap.js';
import { asyncGenerator } from './async.js';
import { memoize } from './memoize.js';

export class TodoApp {
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
        return task.value;
    }
    removeTask() {
        if(this.queue.order.length === 0) {
            return null;
        }
        const task = this.queue.dequeue('highest');
        this.tasks.delete(task.taskId);
        return task.value;
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
    getAllTasks() {
    return Array.from(this.tasks.values());
    }
    async loadStreamTasks(stream) {
        for await (const value of stream) {
            const task = new Task(
                value.taskId,
                "Task " + value.taskId,
                value.color,
                1
            );
            this.tasks.set(task.taskId, task);
            this.queue.enqueue(task, task.priority);
        }
    }
}

 