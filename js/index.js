'use strict'

const todoApp = (function () {
    const todoBody = document.querySelector('.todo__body');
    const headerInput = document.querySelector('.todo__header-input');
    const inputArrow = document.querySelector('.todo__header-arrow');
    const todoListSettings = getFromLocalStorage() || [];

    //Local Storage

    function createDataCell() {
        const storageCell = [];
        localStorage.setItem('todoSettings', JSON.stringify(storageCell));
    }

    function getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('todoSettings'));
    }

    function addToLocalStorage(itemSettings) {
        const todoSettings = getFromLocalStorage();
        todoSettings.push(itemSettings);
        localStorage.setItem('todoSettings', JSON.stringify(todoSettings));
    }

    function updateLocalStorage() {
        let todoSettings = getFromLocalStorage();
        todoSettings = todoListSettings;
        localStorage.setItem('todoSettings', JSON.stringify(todoSettings));
    }

    if (!localStorage.getItem('todoSettings')) {
        createDataCell();
    }

    //END Local Storage

    function renderFromLocalStorage() {
        try {
            const productsInStorage = getFromLocalStorage();
            productsInStorage.forEach((item, index) => {
                if (index === 0) {
                    renderMain(item);
                    if (item.isDone) {
                        const currentItem = document.querySelector(`[data-id=${item.id}]`);
                        currentItem.classList.add('todo__item_done');
                        currentItem.querySelector('.todo__item-check').checked = true;
                    }
                    activateSelectAllBtn();
                    switchClearItemsBtn();
                    updateAmount();
                    inputArrow.classList.add('todo__header-arrow_active');
                } else {
                    renderTodoItem(item);
                    if (item.isDone) {
                        const currentItem = document.querySelector(`[data-id=${item.id}]`);
                        currentItem.classList.add('todo__item_done');
                        currentItem.querySelector('.todo__item-check').checked = true;
                    }
                    activateSelectAllBtn();
                    switchClearItemsBtn();
                    updateAmount();
                }
            });
        } catch (error) {
            console.log(`${error.message} - storage is empty.`);
        }
    }

    renderFromLocalStorage();

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
                <input type="text" class="todo__item-edit">
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
                <span class="todo__filter-text todo__filter-text_all todo__filter-text_active">All</span>
            </li>
            <li class="todo__filter">
                <span class="todo__filter-text todo__filter-text_not-done">Active</span>
            </li>
            <li class="todo__filter">
                <span class="todo__filter-text todo__filter-text_done">Completed</span>
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
                </div>
                <input type="text" class="todo__item-edit">`

        listOfItems.appendChild(todoItem);
    }

    function idGenerator() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function keyDownHandler(e) {
        //Add new item with "Enter" key
        if (e.keyCode === 13 && e.target.classList.contains('todo__header-input') && e.target.value.trim() !== '') {
            const footer = document.querySelector('.todo__footer');
            const todoItemSettings = {};

            if (footer) {
                todoItemSettings.id = idGenerator();
                todoItemSettings.value = e.target.value;
                todoItemSettings.isDone = false;
                renderTodoItem(todoItemSettings);
                e.target.value = '';
            } else {
                todoItemSettings.id = idGenerator();
                todoItemSettings.value = e.target.value;
                todoItemSettings.isDone = false;
                renderMain(todoItemSettings);
                inputArrow.classList.add('todo__header-arrow_active');
                e.target.value = '';
            }

            todoListSettings.push(todoItemSettings);
            addToLocalStorage(todoItemSettings);
            activateSelectAllBtn();
            updateAmount();
        }

        //Save editing with "Enter" key
        if (e.keyCode === 13 && e.target.parentNode.classList.contains('todo__item_editing')) {
            completionOfEditing();
        }
    }

    function updateAmount() {
        const todoAmount = document.querySelector('.todo__amount');
        const todoAmountWord = document.querySelector('.todo__count-items');

        const amountArray = todoListSettings.filter((item) => {
            return item.isDone === false;
        });

        if (todoAmount && todoAmountWord) {
            todoAmount.textContent = amountArray.length;
            todoAmountWord.textContent = (amountArray.length === 1) ? 'item' : 'items';
        }
    }

    function switchClearItemsBtn() {
        const clearItemsBtn = document.querySelector('.todo__footer-btn');

        if (todoListSettings.some(item => item.isDone === true)) {
            clearItemsBtn.classList.add('todo__footer-btn_active');
        } else {
            clearItemsBtn.classList.remove('todo__footer-btn_active');
        }
    }

    function activateSelectAllBtn() {
        if (todoListSettings.every(item => item.isDone) && todoListSettings.length) { //exception vacuously true (empty array)
            inputArrow.classList.add('todo__header-arrow_done');
        } else {
            inputArrow.classList.remove('todo__header-arrow_done');
        }
    }

    function selectAllItems() {
        const todoItems = document.querySelectorAll('.todo__item');

        if (inputArrow.classList.contains('todo__header-arrow_done')) {
            todoListSettings.forEach((item, index) => {
                item.isDone = false;
                todoItems[index].classList.remove('todo__item_done');
                todoItems[index].querySelector('.todo__item-check').checked = false;
            });
        } else {
            todoListSettings.forEach((item, index) => {
                if (!item.isDone) {
                    item.isDone = true;
                    todoItems[index].classList.add('todo__item_done');
                    todoItems[index].querySelector('.todo__item-check').checked = true;
                }
            });
        }

        activateSelectAllBtn();
        switchClearItemsBtn();
        updateLocalStorage();
        updateAmount();
    }

    function clearCompleted() {
        const listOfItems = document.querySelector('.todo__list');
        const todoMain = document.querySelector('.todo__main');
        const footer = document.querySelector('.todo__footer');

        for (let i = 0; i < todoListSettings.length; i++) {
            if (todoListSettings[i].isDone) {
                const element = document.querySelector(`[data-id=${todoListSettings[i].id}]`);
                todoListSettings.splice(i, 1);
                listOfItems.removeChild(element);
                updateLocalStorage();
                --i;
            }
        }
        switchClearItemsBtn();
        activateSelectAllBtn();
        if (!todoListSettings.length) {
            todoBody.removeChild(todoMain);
            todoBody.removeChild(footer);
            inputArrow.classList.remove('todo__header-arrow_active', 'todo__header-arrow_done');
        }
    }

    function activeDoneFilters(target, boolean = true) {
        document.querySelector('.todo__filter-text_active').classList.remove('todo__filter-text_active');
        target.classList.add('todo__filter-text_active');
        todoListSettings.forEach(item => {
            const currentItem = document.querySelector(`[data-id=${item.id}]`);
            currentItem.style.display = '';
        });
        const items = todoListSettings.filter((item) => {
            return item.isDone === boolean;
        });
        items.forEach(item => {
            const doneItem = document.querySelector(`[data-id=${item.id}]`);
            doneItem.style.display = 'none';
        });
    }

    function activateEditingField(e) {
        if (e.target.classList.contains('todo__item-text')) {
            const currentItem = e.target.parentNode.parentNode;
            const editInput = e.target.parentNode.nextElementSibling;
            currentItem.classList.add('todo__item_editing');
            editInput.value = e.target.textContent;
            editInput.focus();
        }
    }

    function completionOfEditing() {
        const editingItem = document.querySelector('.todo__item_editing');
        const editedItem = document.querySelector('.todo__item_editing .todo__item-text');
        const editedInput = document.querySelector('.todo__item_editing .todo__item-edit');
        if (editingItem) {
            editingItem.classList.remove('todo__item_editing');
            editedItem.textContent = editedInput.value;
            todoListSettings.forEach(item => {
                if (editingItem.dataset.id === item.id) {
                    item.value = editedInput.value;
                    updateLocalStorage();
                }
            });
        }
    }

    function todoItemHandler(e) {
        //checkbox eventListener
        if (e.target.classList.contains('todo__item-check')) {
            const listItem = e.target.parentNode.parentNode;

            listItem.classList.toggle('todo__item_done');
            todoListSettings.forEach((item) => {
                if (listItem.dataset.id === item.id) {
                    item.isDone = !item.isDone;
                    updateLocalStorage();
                }
            });
            switchClearItemsBtn();
            activateSelectAllBtn();
            updateAmount();
        }

        //delete item eventListener
        if (e.target.classList.contains('todo__item-del')) {
            const listOfItems = document.querySelector('.todo__list');
            const currentItem = e.target.parentNode.parentNode;
            const todoMain = document.querySelector('.todo__main');
            const footer = document.querySelector('.todo__footer');

            listOfItems.removeChild(currentItem);
            if (todoListSettings.length === 1) {//TODO: DRY
                todoBody.removeChild(todoMain);
                todoBody.removeChild(footer);
                inputArrow.classList.remove('todo__header-arrow_active', 'todo__header-arrow_done');
            }

            //update todoListSettings
            todoListSettings.forEach((item, index) => {
                if (currentItem.dataset.id === item.id) {
                    todoListSettings.splice(index, 1);
                    updateLocalStorage();
                }
            });
            updateAmount();
        }


        //clear-completed eventListener
        if (e.target.classList.contains('todo__footer-btn')) {
            clearCompleted();
        }

        //filter-all eventListener
        if (e.target.classList.contains('todo__filter-text_all')) {
            if (e.target.classList.contains('todo__filter-text_active')) {
                return;
            } else {
                document.querySelector('.todo__filter-text_active').classList.remove('todo__filter-text_active');
                e.target.classList.add('todo__filter-text_active');
                todoListSettings.forEach(item => {
                    const currentItem = document.querySelector(`[data-id=${item.id}]`);
                    currentItem.style.display = '';
                });
            }
        }

        //filter-active eventListener
        if (e.target.classList.contains('todo__filter-text_not-done')) {
            activeDoneFilters(e.target);
        }

        //filter-done eventListener
        if (e.target.classList.contains('todo__filter-text_done')) {
            activeDoneFilters(e.target, false);
        }
    }



    return {
        todoBody: todoBody,
        headerInput: headerInput,
        inputArrow: inputArrow,
        renderMain: renderMain,
        keyDownHandler: keyDownHandler,
        todoItemHandler: todoItemHandler,
        selectAllItems: selectAllItems,
        activateEditingField: activateEditingField,
        completionOfEditing: completionOfEditing
    }

})();

document.body.addEventListener('keydown', todoApp.keyDownHandler);
todoApp.todoBody.addEventListener('click', todoApp.todoItemHandler);
todoApp.inputArrow.addEventListener('click', todoApp.selectAllItems);
todoApp.todoBody.addEventListener('dblclick', todoApp.activateEditingField);
document.body.addEventListener('click', (e) => {
    if (!e.target.classList.contains('todo__item-edit')) {
        todoApp.completionOfEditing();
    }
});