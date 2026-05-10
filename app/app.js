'use strict';

import { asyncGenerator } from '../lib/async.js';
import { Task } from '../lib/task.js';
import { PriorityQueue } from '../lib/priority_queue.js'
import { generator, iterator} from '../lib/generator.js'
import { memoize } from '../lib/memoize.js'

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
const filterButtons = document.querySelectorAll('.filter-btn');
const logButton = document.getElementById('logButton');
const statsBox = document.getElementById('stats');
const clearDone = document.getElementById('clearDone');
const clearAll = document.getElementById('clearAll');

let currentFilter = 'all';
const gen = generator();
let selectedTask = null;
let id = 1;
let editingTaskId = null;
let allTasks = new PriorityQueue();
let stream = null;
loadTasks();
setLastId();
renderTasks();


function updateTaskCount() {
    taskCount.textContent = 'Загальна кількість задач: ' + allTasks.order.length;
}

function saveTask() {
    const data = allTasks.order.map(item => ({
        taskId: item.value.taskId,
        title: item.value.title,
        color: item.value.color,
        priority: item.value.priority,
        done: item.value.done
    }));

    localStorage.setItem('tasks', JSON.stringify(data));
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem('tasks'));
    if (!data) return;
    data.forEach(task => {
        const t = new Task(task.taskId, task.title, task.color, task.priority);
        t.done = task.done;
        allTasks.enqueue(t, task.priority);
    });

}

function setLastId() {
    const data = JSON.parse(localStorage.getItem('tasks'));
    if (!data || data.length === 0) {
    id = 1;
    return;
    }
    let maxId = 0;
    data.forEach(t => {
        if (t.taskId > maxId) {
            maxId = t.taskId;
        }
    });
    id = maxId + 1;
}

function addTask() {
    if (input.value.trim() === '') return;
    const priority = Number(document.getElementById('priority').value);
    const color = gen.next().value;

    if (editingTaskId !== null) {
        allTasks.deleteById(editingTaskId);
        editingTaskId = null;
    }

    const task = new Task(id, input.value, color, priority);
    id++;

    allTasks.enqueue(task, priority);
    saveTask();
    input.value = '';
    renderTasks();
}

function shouldShow(task) {
    if (currentFilter === 'done') return task.done;
    if (currentFilter === 'active') return !task.done;
    if (currentFilter === '1') return task.priority === 1;
    if (currentFilter === '2') return task.priority === 2;
    if (currentFilter === '3') return task.priority === 3;
    return true;
}

function renderTasks() {
    list.innerHTML = '';

    const sortedTasks = [...allTasks.order].sort((a, b) => {
        return b.value.priority - a.value.priority;
    });

    sortedTasks.forEach(item => {
        const task = item.value;

        if (!shouldShow(task)) return;

        const li = document.createElement('li');
        li.dataset.id = task.taskId;
        li.classList.add("priority-" + task.priority);
        li.style.setProperty('--task-color', task.color);

        if (task.done) {
            li.classList.add('done');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-check');
        checkbox.checked = task.done;

        checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            saveTask();

            li.classList.toggle('done', task.done);
        });

        const span = document.createElement('span');
        span.textContent = task.title;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';

        deleteButton.addEventListener('click', () => {
            allTasks.deleteById(task.taskId);
            saveTask();
            renderTasks();
            updateTaskCount();
        });

        const editButton = document.createElement('button');
        editButton.textContent = '✎';

        editButton.addEventListener('click', () => {
            if (li.querySelector('input.edit-input')) return;

            const editInput = document.createElement('input');
            editInput.value = task.title;
            editInput.classList.add('edit-input');

            li.replaceChild(editInput, span);
            editInput.focus();

            const finishEdit = () => {
                const newValue = editInput.value.trim();

                if (newValue !== '') {
                    task.title = newValue;
                    saveTask();
                }

                span.textContent = task.title;
                li.replaceChild(span, editInput);
            };

            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    finishEdit();
                }
            });

            editInput.addEventListener('blur', finishEdit);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });

    updateTaskCount();
}

button.addEventListener('click', () => {
    addTask();
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearDone.addEventListener('click', () => {  
    allTasks.removeDone(); 
    saveTask();  
    renderTasks();  
});

clearAll.addEventListener('click', () => {
    allTasks.order = [];
    saveTask();
    renderTasks();
});

exampleButton.addEventListener('click', async () => {
    previewPanel.classList.remove('hidden');
    overlay.classList.remove('hidden');
    previewList.innerHTML = '';
    for await (const value of asyncGenerator()) {
        const li = document.createElement('li');
        li.textContent = value.taskId + ". " + value.title;
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

