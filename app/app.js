const input = document.getElementById('inputTask');
const button = document.getElementById('addButton');
const list = document.querySelector('ul');
function addTask() {
    const task = input.value;
    if (task.trim() === '') return;
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = task;
    li.appendChild(span);
    li.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        li.classList.toggle('done');
    })
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Видалити завдання';
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
