(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const input = document.getElementById('inputTask');
const button = document.getElementById('addButton');
const exampleButton = document.getElementById('exampleButton');
const previewPanel = document.getElementById('previewPanel');
const previewList = document.getElementById('previewList');
const overlay = document.getElementById('overlay');
const list = document.querySelector('ul');

const { asyncGenerator } = require('../lib/async');
const { Task } = require('../lib/task');

function addTask() {
    const task = input.value;
    if (task.trim() === '') return;
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-check');
    li.appendChild(checkbox);
    checkbox.addEventListener('change', () => {
        if(checkbox.checked) {
            li.classList.add('done')
        }
        else {
            li.classList.remove('done')
        }
    })

    const span = document.createElement('span');
    span.textContent = task;
    li.appendChild(span);
   
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '\u00D7';
    deleteButton.addEventListener('click', () => {
        li.remove();
    })
    li.appendChild(deleteButton);
    list.appendChild(li);
    input.value = '';
}

button.addEventListener('click', () => {
    addTask();
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

exampleButton.addEventListener('click', async () => {
    previewPanel.classList.remove('hidden');
    overlay.classList.remove('hidden');
    previewList.innerHTML = '';
    for await (const value of asyncGenerator()) {
        const li = document.createElement('li');
        li.textContent = value.taskId + ". " + value.title + " (" + value.color + ")";;
        previewList.appendChild(li);
    }
}); 

function updateTaskCount() {

}

},{"../lib/async":2,"../lib/task":3}],2:[function(require,module,exports){
'use strict';

const { Task } = require('./task');

async function* asyncGenerator() {
    let id = 1;
    while(id <= 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        yield {
            taskId: id,
            title: "Task " + id,
            color: 'pink',
            priority: 1
        };
        id++;
    }
}

module.exports = { asyncGenerator }
},{"./task":3}],3:[function(require,module,exports){
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
},{}]},{},[1]);
