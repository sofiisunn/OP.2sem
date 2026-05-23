'use strict';

import { asyncGenerator } from '../lib/async.js';
import { Task } from '../lib/task.js';
import { PriorityQueue } from '../lib/priority_queue.js'
import { generator, iterator} from '../lib/generator.js'
import { memoize } from '../lib/memoize.js'
import { asyncMap } from '../lib/asyncMap.js'
import { EventEmitter } from '../lib/eventEmitter.js'
import { BaseHttpClient } from '../lib/baseHttpClient.js';
import { AuthProxy } from '../lib/authProxy.js';
import { GitHubService } from '../services/gitHubService.js';
import { log } from '../lib/logger.js';

const input = document.getElementById('inputTask');
const button = document.getElementById('addButton');
const exampleButton = document.getElementById('exampleButton');
const previewPanel = document.getElementById('previewPanel');
const previewList = document.getElementById('previewList');
const overlay = document.getElementById('overlay');
const list = document.getElementById('taskList');
const addSelected = document.getElementById('addSelected');
const taskCount = document.getElementById('taskCount');
const filterButtons = document.querySelectorAll('.filter-btn');
const logButton = document.getElementById('logButton');
const statsBox = document.getElementById('stats');
const allDone = document.getElementById('allDone');
const clearDone = document.getElementById('clearDone');
const clearAll = document.getElementById('clearAll');
const closePreview = document.getElementById('closePreview');
const authTestBtn = document.getElementById('authTest');
const authResult = document.getElementById('authResult');

let currentFilter = 'all';
const gen = generator();
let selectedTask = null;
let id = 1;
let editingTaskId = null;
let version = 0;

const getCountText = memoize((count, v) => {
    return 'Загальна кількість задач: ' + count;
}, 10);

const bus = new EventEmitter();

bus.subscribe('task:added', () => {
    renderTasks();
    updateTaskCount();
});

bus.subscribe('task:deleted', () => {
    renderTasks();
    updateTaskCount();
});

bus.subscribe('task:completed', () => {
    renderTasks();
    updateTaskCount();
});

bus.subscribe('error', (err) => {
    console.error('Bus error:', err);
});

let allTasks = new PriorityQueue();
let stream = null;
loadTasks();
setLastId();
renderTasks();

function getToken() {
    return localStorage.getItem('token') || 'demo-token';
}

const client = new BaseHttpClient();
const token = getToken();

const authClient = new AuthProxy(client, token);
const gitHubService = new GitHubService(authClient);

function updateTaskCount() {
    const text = getCountText(allTasks.order.length, version);
    taskCount.textContent = text;
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

async function markAllDone() {
    const tasks = allTasks.order.map(x => x.value);

    await asyncMap(tasks, (task) => {
        task.done = true;
        return task;
    });

    saveTask();
    renderTasks();
}

function displayLogPanel(logObj) {
    const panel = document.getElementById('logPanel');
    if (!panel) return;

    panel.innerHTML = '';

    const lines = [];

    const timestamp = new Date(logObj.timestamp).toLocaleString();

    let result = '';

    if (logObj.result === undefined || logObj.result === null) {
        result = 'н/д';
    } else {
        if (typeof logObj.result === 'object') {
            result = JSON.stringify(logObj.result);
        } else {
            result = "" + logObj.result;
        }
    }

    lines.push("[" + logObj.level + "] " + timestamp);
    lines.push("Результат: " + result);

    let timeText = '';

    if (logObj.time) {
        timeText = logObj.time.toFixed(4) + " мс";
    } else {
        timeText = "н/д";
    }

    lines.push("Час виконання: " + timeText);

    if (logObj.args) {
        lines.push("Аргументи: " + JSON.stringify(logObj.args));
    }

    if (logObj.error) {
        let errText = '';

        if (logObj.error.message) {
            errText = logObj.error.message;
        } else {
            errText = "" + logObj.error;
        }

        lines.push("Помилка: " + errText);
    }

    const logContainer = document.createElement('div');
    logContainer.textContent = lines.join("\n");

    panel.appendChild(logContainer);
}

const addTask = log('DEBUG', displayLogPanel)(function() {
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
    version++;
    saveTask();
    bus.emit('task:added', task);
    input.value = '';
    renderTasks();
})

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
        li.draggable = true;

        if (task.done) {
            li.classList.add('done');
        }

        // --- Drag & Drop ---
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.taskId);
            li.style.opacity = '0.4';
        });

        li.addEventListener('dragend', () => {
            li.style.opacity = '1';
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            li.style.borderTop = '3px solid #f48fb1';
        });

        li.addEventListener('dragleave', () => {
            li.style.borderTop = '';
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.style.borderTop = '';
            const draggedId = Number(e.dataTransfer.getData('text/plain'));
            const targetId = task.taskId;
            if (draggedId === targetId) return;

            const draggedIndex = allTasks.order.findIndex(x => x.value.taskId === draggedId);
            const targetIndex = allTasks.order.findIndex(x => x.value.taskId === targetId);

            if (draggedIndex === -1 || targetIndex === -1) return;

            const [draggedItem] = allTasks.order.splice(draggedIndex, 1);
            allTasks.order.splice(targetIndex, 0, draggedItem);

            saveTask();
            renderTasks();
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-check');
        checkbox.checked = task.done;

        checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            saveTask();
            bus.emit('task:completed', task);
            li.classList.toggle('done', task.done);
        });

        const span = document.createElement('span');
        span.textContent = task.title;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';

        deleteButton.addEventListener('click', () => {
            allTasks.deleteById(task.taskId);
            saveTask();
            bus.emit('task:deleted', task);
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
                if (e.key === 'Enter') finishEdit();
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

allDone.addEventListener('click', () => {
    markAllDone();
});

clearDone.addEventListener('click', () => {  
    allTasks.removeDone();
    version++; 
    saveTask();  
    renderTasks();  
});

clearAll.addEventListener('click', () => {
    allTasks.order = [];
    version++;
    saveTask();
    renderTasks();
});

function closePanel() {
    previewPanel.classList.add('hidden');
    overlay.classList.add('hidden');
    selectedTask = null;
}

closePreview.addEventListener('click', closePanel);

overlay.addEventListener('click', closePanel);

exampleButton.addEventListener('click', async () => {
    previewPanel.classList.remove('hidden');
    overlay.classList.remove('hidden');

    previewList.innerHTML = '';

    try {
        for await (const value of asyncGenerator()) {
            const li = document.createElement('li');
            li.textContent = value.title;

            previewList.appendChild(li);

            li.addEventListener('click', () => {
                selectedTask = value;

                const items = previewList.querySelectorAll('li');
                items.forEach(el => el.style.background = '');

                li.style.background = '#ffd1dc';
            });
        }
    } catch (err) {
        console.error("Stream error:", err);
        previewList.innerHTML = "Помилка завантаження потоку";
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

authTestBtn.addEventListener('click', async () => {
    authResult.classList.remove('hidden');
    authResult.innerHTML = 'Завантаження...';

    try {
        authClient.setMethod('jwt');
        const jwtUser = await gitHubService.getUser('sofiisunn');

        authClient.setMethod('apiKey');
        const apiUser = await gitHubService.getUser('sofiisunn');

        authClient.setMethod('oauth');
        const oauthUser = await gitHubService.getUser('sofiisunn');

        authResult.innerHTML =
        jwtUser.login + ' | ' +
        apiUser.login + ' | ' +
        oauthUser.login;
    }
    catch (e) {
        authResult.innerHTML = 'Помилка завантаження';
    }
})
