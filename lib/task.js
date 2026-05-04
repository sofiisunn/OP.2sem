'use strict';

export class Task {
    constructor(id, title, color, priority) {
        this.taskId = id;
        this.title = title;
        this.color = color;
        this.done = false;
        this.priority = priority;
    }
}

