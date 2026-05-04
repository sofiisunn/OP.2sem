'use strict';

export function* generator() {
    const colors = [
        "#ffc8a2", 
        "#fff3b0", 
        "#bde0fe", 
        "#cdb4db",  
        "#d8f3dc"  
    ];
    let i = 0;

    while (true) {
        yield colors[i];

        i++;
        if (i >= colors.length) i = 0;
    }
}

export function iterator(gen, time) {
    const startTime = Date.now();

    const interval = setInterval(() => {
        const tasks = document.querySelectorAll('#taskList li');
        if (tasks.length === 0) return;

        const color = gen.next().value;

        tasks.forEach(task => {
            task.style.setProperty('--shadow-color', color);
        });

        if (Date.now() - startTime >= time) {
            clearInterval(interval);
        }
    }, 1000);
}

