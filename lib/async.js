'use strict';

const { Task } = require('./task');

async function* asyncGenerator() {
    let id = 1;
    while(id <= 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        yield new Task(id, "Task" + id, 'pink', 1 );
        id++;
    }
}

module.exports = { asyncGenerator }