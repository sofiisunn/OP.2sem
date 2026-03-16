'use strict';

class Task {
    constructor(id, title, color) {
        this.taskId = id;
        this.title = title;
        this.color = color;
    }
}

module.exports = { Task };