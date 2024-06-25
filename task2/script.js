document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const taskName = document.getElementById('taskName').value;
        const deadline = document.getElementById('deadline').value;
        const priority = document.getElementById('priority').value;
        const label = document.getElementById('label').value;

        const task = {
            id: Date.now(),
            taskName,
            deadline,
            priority,
            label,
            completed: false
        };

        addTaskToList(task);
        clearForm();
    });

    document.getElementById('taskList').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = e.target.closest('.task').dataset.id;
            removeTask(taskId);
        } else if (e.target.classList.contains('edit-btn')) {
            const taskId = e.target.closest('.task').dataset.id;
            editTask(taskId);
        } else if (e.target.classList.contains('complete-checkbox')) {
            const taskId = e.target.closest('.task').dataset.id;
            toggleComplete(taskId, e.target.checked);
        }
    });

    loadTasks();
});

function addTaskToList(task) {
    const taskList = document.getElementById('taskList');

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.dataset.id = task.id;

    const daysLeft = calculateDaysLeft(task.deadline);

    taskDiv.innerHTML = `
        <div>
            <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
            <p><strong>Task:</strong> ${task.taskName}</p>
            <p><strong>Deadline:</strong> ${task.deadline} <span class="days-left">(${daysLeft} days left)</span></p>
            <p class="priority"><strong>Priority:</strong> ${task.priority}</p>
            <p class="label">${task.label}</p>
        </div>
        <div class="btn-group">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
            <p class="status">${task.completed ? 'Completed' : ''}</p>
        </div>
    `;

    taskList.appendChild(taskDiv);
    sortTasks();
}

function clearForm() {
    document.getElementById('taskForm').reset();
}

function calculateDaysLeft(deadline) {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();

    const timeDifference = deadlineDate - currentDate;
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysLeft >= 0 ? daysLeft : 'Deadline passed';
}

function removeTask(taskId) {
    const taskList = document.getElementById('taskList');
    const taskElement = taskList.querySelector(`[data-id='${taskId}']`);
    taskList.removeChild(taskElement);
}

function editTask(taskId) {
    const taskList = document.getElementById('taskList');
    const taskElement = taskList.querySelector(`[data-id='${taskId}']`);

    const taskName = prompt('Enter new task name:', taskElement.querySelector('p').textContent.replace('Task: ', ''));
    const deadline = prompt('Enter new deadline:', taskElement.querySelector('p:nth-child(3)').textContent.replace('Deadline: ', '').split(' ')[0]);
    const priority = prompt('Enter new priority:', taskElement.querySelector('.priority').textContent.replace('Priority: ', ''));
    const label = prompt('Enter new label:', taskElement.querySelector('.label').textContent);

    if (taskName && deadline && priority && label) {
        taskElement.querySelector('p').innerHTML = `<strong>Task:</strong> ${taskName}`;
        const daysLeft = calculateDaysLeft(deadline);
        taskElement.querySelector('p:nth-child(3)').innerHTML = `<strong>Deadline:</strong> ${deadline} <span class="days-left">(${daysLeft} days left)</span>`;
        taskElement.querySelector('.priority').innerHTML = `<strong>Priority:</strong> ${priority}`;
        taskElement.querySelector('.label').innerHTML = `${label}`;
        sortTasks();
    }
}

function toggleComplete(taskId, isCompleted) {
    const taskList = document.getElementById('taskList');
    const taskElement = taskList.querySelector(`[data-id='${taskId}']`);

    if (isCompleted) {
        taskElement.classList.add('completed');
    } else {
        taskElement.classList.remove('completed');
    }

    taskElement.querySelector('.status').textContent = isCompleted ? 'Completed' : '';
}

function sortTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.getElementsByClassName('task'));

    tasks.sort((a, b) => {
        const priorityOrder = ['High', 'Medium', 'Low'];
        const priorityA = priorityOrder.indexOf(a.querySelector('.priority').textContent.replace('Priority: ', ''));
        const priorityB = priorityOrder.indexOf(b.querySelector('.priority').textContent.replace('Priority: ', ''));

        return priorityA - priorityB;
    });

    tasks.forEach(task => taskList.appendChild(task));
}

function loadTasks() {
    // Placeholder for loading tasks from local storage or a server
}
