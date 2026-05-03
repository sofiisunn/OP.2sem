'use strict';

import { asyncGenerator } from '../lib/async.js';
import { Task } from '../lib/task.js';
import { PriorityQueue } from '../lib/priority_queue.js'

const input = document.getElementById('inputTask');
const button = document.getElementById('addButton');
const exampleButton = document.getElementById('exampleButton');
const previewPanel = document.getElementById('previewPanel');
const previewList = document.getElementById('previewList');
const overlay = document.getElementById('overlay');
const list = document.getElementById('taskList');
const addSelected = document.getElementById('addSelected');
const taskCount = document.getElementById('taskCount');
const filter = document.getElementById('filter');

let selectedTask = null;
let id = 1;
let allTasks = new PriorityQueue();

function updateTaskCount() {
    taskCount.textContent = 'Задач: ' + allTasks.order.length;
}

function addTask() {
    if (input.value.trim() === '') return;
    const priority = Number(document.getElementById('priority').value);
    const task = new Task(id, input.value, null, priority);
    id++;
    allTasks.enqueue(task, priority);
    const li = document.createElement('li');
    li.dataset.id = task.taskId;
    li.classList.add("priority-" + priority);
    updateTaskCount();

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-check');
    li.appendChild(checkbox);
    checkbox.addEventListener('change', () => {
        const taskId = Number(li.dataset.id);
        const found = allTasks.order.find(t => t.value.taskId === taskId);
        if (found) {
            found.value.done = checkbox.checked;
        }
        if(checkbox.checked) {
            li.classList.add('done');
        }
        else {
            li.classList.remove('done')
        }
    })

    const span = document.createElement('span');
    span.textContent = task.title;
    li.appendChild(span);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '\u00D7';
    deleteButton.addEventListener('click', () => {
        const taskId = Number(li.dataset.id);
        allTasks.deleteById(taskId);
        li.remove();
        updateTaskCount();
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