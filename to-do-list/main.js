'use strict';
const apiKey = '50d2199a-42dc-447d-81ed-d68a443b697e';
const apiUrl = 'http://tasks-api.std-900.ist.mospolytech.ru/api/tasks';

async function sendRequest(url, method, data = {}) {
    try {
        const response = await fetch(url + `?api_key=${apiKey}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Произошла ошибка при выполнении запроса.');
        }

        return await response.json();
    } catch (error) {
        showAlert(`Ошибка: ${error.message}`, 'danger');
    }
}

function showAlert(msg, category='success') {
    let alertsContainer = document.querySelector('.alerts');
    let newAlertElement = document.getElementById('alerts-template').cloneNode(true);
    newAlertElement.querySelector('.msg').innerHTML = msg;
    newAlertElement.classList.remove('d-none');
    alertsContainer.append(newAlertElement);
}

async function createTaskElement(form) {
    const data = {
        name: form.elements['name'].value,
        desc: form.elements['description'].value,
        status: form.elements['column'].value,
    };

    try {
        const responseData = await sendRequest(apiUrl, 'POST', data);
        const newTaskElement = document.getElementById('task-template').cloneNode(true);
        newTaskElement.id = responseData.id;
        newTaskElement.querySelector('.task-name').innerHTML = responseData.name;
        newTaskElement.querySelector('.task-description').innerHTML = responseData.desc;
        newTaskElement.classList.remove('d-none');
        for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
            btn.onclick = moveBtnHandler;
        }

        return newTaskElement;
    } catch (error) {
        showAlert(`Ошибка: ${error.message}`, 'danger');
    }
}

async function updateTask(form) {
    const taskId = form.elements['task-id'].value;
    const data = {
        name: form.elements['name'].value,
        desc: form.elements['description'].value,
        status: form.elements['column'].value,
    };

    try {
        await sendRequest(`${apiUrl}/${taskId}`, 'PUT', data);
    } catch (error) {
        showAlert(`Ошибка: ${error.message}`, 'danger');
    }
}

async function removeTaskBtnHandler(event) {
    const form = event.target.closest('.modal').querySelector('form');
    const taskId = form.elements['task-id'].value;

    try {
        await sendRequest(`${apiUrl}/${taskId}`, 'DELETE');
    } catch (error) {
        showAlert(`Ошибка: ${error.message}`, 'danger');
    }

    const taskElement = document.getElementById(taskId);
    const tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;
    taskElement.remove();
}

function createTaskElement(form) {
    let newTaskElement = document.getElementById('task-template').cloneNode(true);
    newTaskElement.id = taskCounter++;
    newTaskElement.querySelector('.task-name').innerHTML = form.elements['name'].value;
    newTaskElement.querySelector('.task-description').innerHTML = form.elements['description'].value;
    newTaskElement.classList.remove('d-none');
    for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }
    return newTaskElement
}

function updateTask(form) {
    let taskElement = document.getElementById(form.elements['task-id'].value);
    taskElement.querySelector('.task-name').innerHTML = form.elements['name'].value;
    taskElement.querySelector('.task-description').innerHTML = form.elements['description'].value;
}


function actionTaskBtnHandler(event) {
    let form, listElement, tasksCounterElement, alertMsg, action;
    form = event.target.closest('.modal').querySelector('form');
    action = form.elements['action'].value;

    if (action == 'create') {
        listElement = document.getElementById(`${form.elements['column'].value}-list`);
        listElement.append(createTaskElement(form));
    
        tasksCounterElement = listElement.closest('.card').querySelector('.tasks-counter');
        tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
    
        alertMsg = `Задача ${form.elements['name'].value} была успешно создана!`;
    } else if (action == 'edit') {
        updateTask(form);

        alertMsg = `Задача ${form.elements['name'].value} была успешно обновлена!`;
    }

    if (alertMsg) {
        showAlert(alertMsg);
    }
}

function resetForm(form) {
    form.reset();
    form.querySelector('select').closest('.mb-3').classList.remove('d-none');
    form.elements['name'].classList.remove('form-control-plaintext');
    form.elements['description'].classList.remove('form-control-plaintext');
}

function setFormValues(form, taskId) {
    let taskElement = document.getElementById(taskId);
    form.elements['name'].value = taskElement.querySelector('.task-name').innerHTML;
    form.elements['description'].value = taskElement.querySelector('.task-description').innerHTML;
    form.elements['task-id'].value = taskId;
}

function prepareModalContent(event) {
    let form = event.target.querySelector('form');
    resetForm(form);

    let action = event.relatedTarget.dataset.action || 'create';

    form.elements['action'].value = action;
    event.target.querySelector('.modal-title').innerHTML = titles[action];
    event.target.querySelector('.action-task-btn').innerHTML = actionBtnText[action];

    if (action == 'show' || action == 'edit') {
        setFormValues(form, event.relatedTarget.closest('.task').id);
        event.target.querySelector('select').closest('.mb-3').classList.add('d-none');
    }

    if (action == 'show') {
        form.elements['name'].classList.add('form-control-plaintext');
        form.elements['description'].classList.add('form-control-plaintext');
    }

}

function removeTaskBtnHandler(event) {
    let form = event.target.closest('.modal').querySelector('form');
    let taskElement = document.getElementById(form.elements['task-id'].value);

    let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;

    taskElement.remove();
}

function moveBtnHandler(event) {
    let taskElement = event.target.closest('.task');
    let currentListElement = taskElement.closest('ul');
    let targetListElement = document.getElementById(currentListElement.id == 'to-do-list' ? 'done-list' : 'to-do-list');

    let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;

    targetListElement.append(taskElement);

    tasksCounterElement = targetListElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
}

let taskCounter = 0;

let titles = {
    'create': 'Создание новой задачи',
    'edit': 'Редактирование задачи',
    'show': 'Просмотр задачи'
}

let actionBtnText = {
    'create': 'Создать',
    'edit': 'Сохранить',
    'show': 'Ок'
}

window.onload = function () {
    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;

    document.getElementById('task-modal').addEventListener('show.bs.modal', prepareModalContent);

    document.getElementById('remove-task-modal').addEventListener('show.bs.modal', function (event) {
        let taskElement = event.relatedTarget.closest('.task');
        let form = event.target.querySelector('form');
        form.elements['task-id'].value = taskElement.id;
        event.target.querySelector('.task-name').innerHTML = taskElement.querySelector('.task-name').innerHTML;
    });
    document.querySelector('.remove-task-btn').onclick = removeTaskBtnHandler;

    for (let btn of document.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }
}