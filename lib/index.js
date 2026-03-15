'use strict';

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
function* generator() {
    let colorInd = 0;
    let id = 1;
    while(true) {
        let i = {taskId: id, color: colors[colorInd]};
        yield i;
        id += 1;
        colorInd += 1;
        if (colorInd >= colors.length) {
        colorInd = 0;
        }
    }
}

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

module.exports = {generator, iterator};