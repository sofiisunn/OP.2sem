'use strict';

import { asyncGenerator } from '../lib/async.js';
import { Task } from '../lib/task.js';

const input = document.getElementById('inputTask');
const button = document.getElementById('addButton');
const exampleButton = document.getElementById('exampleButton');
const previewPanel = document.getElementById('previewPanel');
const previewList = document.getElementById('previewList');
const overlay = document.getElementById('overlay');
const list = document.getElementById('taskList');
const addSelected = document.getElementById('addSelected');

let selectedTask = null;

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
        li.textContent = value.taskId + ". " + value.title + " (" + value.color + ")";
        previewList.appendChild(li);
        li.addEventListener('click', () => {
            selectedTask = value;
            document.querySelectorAll('#previewList li').forEach(el => {
                el.style.background = '';
            });
            li.style.background = '#ffd1dc';
        });
    }
}); 

addSelected.addEventListener('click', () => {
    if (!selectedTask) return;

    input.value = selectedTask.title;
    addTask();

    previewPanel.classList.add('hidden');
    overlay.classList.add('hidden');
});

overlay.addEventListener('click', () => {
    previewPanel.classList.add('hidden');
    overlay.classList.add('hidden');
});