'use strict';

class Task {
    constructor(id, title, color, priority) {
        this.taskId = id;
        this.title = title;
        this.color = color;
        this.status = "new";
        this.createdAt = new Date();
        this.priority = priority;
    }
}

module.exports = { Task };