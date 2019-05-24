'use strict'

const todoApp = (function () {
    const todoBody = document.querySelector('.todo__body');
    const headerInput = document.querySelector('.todo__header-input');
    const todoList = [];

    function renderMain(settings) {
        const buffer = document.createDocumentFragment();
        const todoMain = document.createElement('section');
        const todoFooter = document.createElement('footer');

        todoMain.classList.add('todo__main');
        todoMain.innerHTML =
            `<ul class="todo__list">
            <li class="todo__item" data-id = "${settings.id}">
                <label class="todo__item-label">
                    <input type="checkbox" class="todo__item-check">
                    <span class="todo__checkbox"></span>
                </label>
                <div class="todo__item-space">
                    <p class="todo__item-text">${settings.value}</p>
                    <button class="todo__item-del"></button>
                </div>
            </li>
        </ul>`
        buffer.appendChild(todoMain);

        todoFooter.classList.add('todo__footer');
        todoFooter.innerHTML =
            `<span class="todo__count">
            <span class="todo__amount">0</span>
            <span class="todo__count-items"></span>
            <span class="todo__count-left">left</span>
        </span>
        <ul class="todo__filters">
            <li class="todo__filter">
                <span class="todo__filter-text todo__filter-text_active">All</span>
            </li>
            <li class="todo__filter">
                <span class="todo__filter-text">Active</span>
            </li>
            <li class="todo__filter">
                <span class="todo__filter-text">Completed</span>
            </li>
        </ul>
        <button class="todo__footer-btn">Clear completed</button>`
        buffer.appendChild(todoFooter);

        todoBody.appendChild(buffer);
    }

    function renderTodoItem(settings) {
        const listOfItems = document.querySelector('.todo__list');
        const todoItem = document.createElement('li');

        todoItem.classList.add('todo__item');
        todoItem.setAttribute('data-id', settings.id);
        todoItem.innerHTML =
            `<label class="todo__item-label">
                    <input type="checkbox" class="todo__item-check">
                    <span class="todo__checkbox"></span>
                </label>
                <div class="todo__item-space">
                    <p class="todo__item-text">${settings.value}</p>
                    <button class="todo__item-del"></button>
                </div>`

        listOfItems.appendChild(todoItem);
    }

    function idGenerator() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function headerInputHandler(e) {
        const headerInputWrap = document.querySelector('.todo__header-input-wrap');
        const footer = document.querySelector('.todo__footer');
        const todoItemSettings = {};

        if (e.keyCode === 13 && this.value.trim() !== '') {
            if (footer) {
                todoItemSettings.id = idGenerator();
                todoItemSettings.value = this.value;
                todoItemSettings.isDone = false;
                renderTodoItem(todoItemSettings);
                this.value = '';
            } else {
                todoItemSettings.id = idGenerator();
                todoItemSettings.value = this.value;
                todoItemSettings.isDone = false;
                renderMain(todoItemSettings);
                headerInputWrap.classList.add('todo__header-input-wrap_active');
                this.value = '';
            }

            todoList.push(todoItemSettings);
            updateAmount();
        }
    }

    function updateAmount() {
        const todoAmount = document.querySelector('.todo__amount');
        const todoAmountWord = document.querySelector('.todo__count-items');

        const amountArray = todoList.filter((item) => {
            return item.isDone === false;
        });
        todoAmount.textContent = amountArray.length;
        todoAmountWord.textContent = (amountArray.length === 1) ? 'item' : 'items';
    }

    function todoItemHandler(e) {
        //checkbox eventListener
        if (e.target.classList.contains('todo__item-check')) {
            const itemText = e.target.parentNode.nextElementSibling.firstElementChild;
            const listItem = e.target.parentNode.parentNode;

            itemText.classList.toggle('todo__item-text_done');
            todoList.forEach((item) => {
                if (listItem.dataset.id === item.id) {
                    item.isDone = !item.isDone;
                }
            });
            updateAmount();
        }

        //delete item eventListener
        if (e.target.classList.contains('todo__item-del')) {
            const listOfItems = document.querySelector('.todo__list');
            const currentItem = e.target.parentNode.parentNode;

            listOfItems.removeChild(currentItem);
            todoList.forEach((item) => {
                if (currentItem.dataset.id === item.id) {
                    todoList.splice(todoList.indexOf(item), 1);
                }
            });
            updateAmount();
            console.log(todoList);
        }
    }

    return {
        todoBody: todoBody,
        headerInput: headerInput,
        renderMain: renderMain,
        headerInputHandler: headerInputHandler,
        todoItemHandler: todoItemHandler
    }

})();

todoApp.headerInput.addEventListener('keydown', todoApp.headerInputHandler);
todoApp.todoBody.addEventListener('click', todoApp.todoItemHandler);