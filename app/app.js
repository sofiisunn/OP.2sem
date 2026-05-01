'use strict';

const input = document.getElementById('inputTask');
const button = document.getElementById('addButton');
const list = document.querySelector('ul');

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

function updateTaskCount() {

}
