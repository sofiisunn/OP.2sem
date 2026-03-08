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

module.exports = generator;