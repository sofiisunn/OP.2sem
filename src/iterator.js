'use strict';

function iterator(gen, time) {
    const startTime = Date.now();
    let iteration = 1;

    const interval = setInterval (() => {
        const value = gen.next().value;
        const currentTime = new Date().toLocaleTimeString();
        console.log("Iteration: " + iteration + ", Title: Task " + value.taskId + ", Color: " + value.color + ", Time: " + currentTime);
        iteration += 1;

        if (Date.now() - startTime >= time) {
            clearInterval(interval);
        }
    }, 1000);
}

module.exports = iterator;