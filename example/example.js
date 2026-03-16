'use strict';

const lib = require('lab2-op');

const gen = lib.generator();
const tasks = [];

for(let i = 0; i < 10; i++) {
    const value = gen.next().value;
    const task = new lib.Task(value.taskId, "Task " + value.taskId, value.color);
    tasks.push(task);
}

for(const task of tasks) {
    console.log(task);
}