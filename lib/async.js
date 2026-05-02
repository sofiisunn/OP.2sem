'use strict';

import { Task } from './task.js';

export async function* asyncGenerator() {
    let id = 1;
    while(id <= 100) {
        await new Promise(resolve => setTimeout(resolve, 100))
        yield new Task(id, "Task" + id, 'pink', 1 );
        id++;
    }
}



