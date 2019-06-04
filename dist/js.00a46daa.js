// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/index.js":[function(require,module,exports) {
'use strict';

var todoApp = function () {
  var todoBody = document.querySelector('.todo__body');
  var headerInput = document.querySelector('.todo__header-input');
  var inputArrow = document.querySelector('.todo__header-arrow');
  var todoListSettings = getFromLocalStorage() || []; //Local Storage

  function createDataCell() {
    var storageCell = [];
    localStorage.setItem('todoSettings', JSON.stringify(storageCell));
  }

  function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todoSettings'));
  }

  function addToLocalStorage(itemSettings) {
    var todoSettings = getFromLocalStorage();
    todoSettings.push(itemSettings);
    localStorage.setItem('todoSettings', JSON.stringify(todoSettings));
  }

  function updateLocalStorage() {
    var todoSettings = getFromLocalStorage();
    todoSettings = todoListSettings;
    localStorage.setItem('todoSettings', JSON.stringify(todoSettings));
  }

  if (!localStorage.getItem('todoSettings')) {
    createDataCell();
  } //END Local Storage


  function renderFromLocalStorage() {
    try {
      var productsInStorage = getFromLocalStorage();
      productsInStorage.forEach(function (item, index) {
        if (index === 0) {
          renderMain(item);

          if (item.isDone) {
            var currentItem = document.querySelector("[data-id=".concat(item.id, "]"));
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
            var _currentItem = document.querySelector("[data-id=".concat(item.id, "]"));

            _currentItem.classList.add('todo__item_done');

            _currentItem.querySelector('.todo__item-check').checked = true;
          }

          activateSelectAllBtn();
          switchClearItemsBtn();
          updateAmount();
        }
      });
    } catch (error) {
      console.log("".concat(error.message, " - storage is empty."));
    }
  }

  renderFromLocalStorage();

  function renderMain(settings) {
    var buffer = document.createDocumentFragment();
    var todoMain = document.createElement('section');
    var todoFooter = document.createElement('footer');
    todoMain.classList.add('todo__main');
    todoMain.innerHTML = "<ul class=\"todo__list\">\n            <li class=\"todo__item\" data-id = \"".concat(settings.id, "\">\n                <label class=\"todo__item-label\">\n                    <input type=\"checkbox\" class=\"todo__item-check\">\n                    <span class=\"todo__checkbox\"></span>\n                </label>\n                <div class=\"todo__item-space\">\n                    <p class=\"todo__item-text\">").concat(settings.value, "</p>\n                    <button class=\"todo__item-del\"></button>\n                </div>\n                <input type=\"text\" class=\"todo__item-edit\">\n            </li>\n        </ul>");
    buffer.appendChild(todoMain);
    todoFooter.classList.add('todo__footer');
    todoFooter.innerHTML = "<span class=\"todo__count\">\n            <span class=\"todo__amount\">0</span>\n            <span class=\"todo__count-items\"></span>\n            <span class=\"todo__count-left\">left</span>\n        </span>\n        <ul class=\"todo__filters\">\n            <li class=\"todo__filter\">\n                <span class=\"todo__filter-text todo__filter-text_all todo__filter-text_active\">All</span>\n            </li>\n            <li class=\"todo__filter\">\n                <span class=\"todo__filter-text todo__filter-text_not-done\">Active</span>\n            </li>\n            <li class=\"todo__filter\">\n                <span class=\"todo__filter-text todo__filter-text_done\">Completed</span>\n            </li>\n        </ul>\n        <button class=\"todo__footer-btn\">Clear completed</button>";
    buffer.appendChild(todoFooter);
    todoBody.appendChild(buffer);
  }

  function renderTodoItem(settings) {
    var listOfItems = document.querySelector('.todo__list');
    var todoItem = document.createElement('li');
    todoItem.classList.add('todo__item');
    todoItem.setAttribute('data-id', settings.id);
    todoItem.innerHTML = "<label class=\"todo__item-label\">\n                    <input type=\"checkbox\" class=\"todo__item-check\">\n                    <span class=\"todo__checkbox\"></span>\n                </label>\n                <div class=\"todo__item-space\">\n                    <p class=\"todo__item-text\">".concat(settings.value, "</p>\n                    <button class=\"todo__item-del\"></button>\n                </div>\n                <input type=\"text\" class=\"todo__item-edit\">");
    listOfItems.appendChild(todoItem);
  }

  function idGenerator() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  function keyDownHandler(e) {
    //Add new item with "Enter" key
    if (e.keyCode === 13 && e.target.classList.contains('todo__header-input') && e.target.value.trim() !== '') {
      var footer = document.querySelector('.todo__footer');
      var todoItemSettings = {};

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
    } //Save editing with "Enter" key


    if (e.keyCode === 13 && e.target.parentNode.classList.contains('todo__item_editing')) {
      completionOfEditing();
    }
  }

  function updateAmount() {
    var todoAmount = document.querySelector('.todo__amount');
    var todoAmountWord = document.querySelector('.todo__count-items');
    var amountArray = todoListSettings.filter(function (item) {
      return item.isDone === false;
    });

    if (todoAmount && todoAmountWord) {
      todoAmount.textContent = amountArray.length;
      todoAmountWord.textContent = amountArray.length === 1 ? 'item' : 'items';
    }
  }

  function switchClearItemsBtn() {
    var clearItemsBtn = document.querySelector('.todo__footer-btn');

    if (todoListSettings.some(function (item) {
      return item.isDone === true;
    })) {
      clearItemsBtn.classList.add('todo__footer-btn_active');
    } else {
      clearItemsBtn.classList.remove('todo__footer-btn_active');
    }
  }

  function activateSelectAllBtn() {
    if (todoListSettings.every(function (item) {
      return item.isDone;
    }) && todoListSettings.length) {
      //exception vacuously true (empty array)
      inputArrow.classList.add('todo__header-arrow_done');
    } else {
      inputArrow.classList.remove('todo__header-arrow_done');
    }
  }

  function selectAllItems() {
    var todoItems = document.querySelectorAll('.todo__item');

    if (inputArrow.classList.contains('todo__header-arrow_done')) {
      todoListSettings.forEach(function (item, index) {
        item.isDone = false;
        todoItems[index].classList.remove('todo__item_done');
        todoItems[index].querySelector('.todo__item-check').checked = false;
      });
    } else {
      todoListSettings.forEach(function (item, index) {
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
    var listOfItems = document.querySelector('.todo__list');
    var todoMain = document.querySelector('.todo__main');
    var footer = document.querySelector('.todo__footer');

    for (var i = 0; i < todoListSettings.length; i++) {
      if (todoListSettings[i].isDone) {
        var element = document.querySelector("[data-id=".concat(todoListSettings[i].id, "]"));
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

  function activeDoneFilters(target) {
    var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    document.querySelector('.todo__filter-text_active').classList.remove('todo__filter-text_active');
    target.classList.add('todo__filter-text_active');
    todoListSettings.forEach(function (item) {
      var currentItem = document.querySelector("[data-id=".concat(item.id, "]"));
      currentItem.style.display = '';
    });
    var items = todoListSettings.filter(function (item) {
      return item.isDone === boolean;
    });
    items.forEach(function (item) {
      var doneItem = document.querySelector("[data-id=".concat(item.id, "]"));
      doneItem.style.display = 'none';
    });
  }

  function activateEditingField(e) {
    if (e.target.classList.contains('todo__item-text')) {
      var currentItem = e.target.parentNode.parentNode;
      var editInput = e.target.parentNode.nextElementSibling;
      currentItem.classList.add('todo__item_editing');
      editInput.value = e.target.textContent;
      editInput.focus();
    }
  }

  function completionOfEditing() {
    var editingItem = document.querySelector('.todo__item_editing');
    var editedItem = document.querySelector('.todo__item_editing .todo__item-text');
    var editedInput = document.querySelector('.todo__item_editing .todo__item-edit');

    if (editingItem) {
      editingItem.classList.remove('todo__item_editing');
      editedItem.textContent = editedInput.value;
      todoListSettings.forEach(function (item) {
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
      var listItem = e.target.parentNode.parentNode;
      listItem.classList.toggle('todo__item_done');
      todoListSettings.forEach(function (item) {
        if (listItem.dataset.id === item.id) {
          item.isDone = !item.isDone;
          updateLocalStorage();
        }
      });
      switchClearItemsBtn();
      activateSelectAllBtn();
      updateAmount();
    } //delete item eventListener


    if (e.target.classList.contains('todo__item-del')) {
      var listOfItems = document.querySelector('.todo__list');
      var currentItem = e.target.parentNode.parentNode;
      var todoMain = document.querySelector('.todo__main');
      var footer = document.querySelector('.todo__footer');
      listOfItems.removeChild(currentItem);

      if (todoListSettings.length === 1) {
        //TODO: DRY
        todoBody.removeChild(todoMain);
        todoBody.removeChild(footer);
        inputArrow.classList.remove('todo__header-arrow_active', 'todo__header-arrow_done');
      } //update todoListSettings


      todoListSettings.forEach(function (item, index) {
        if (currentItem.dataset.id === item.id) {
          todoListSettings.splice(index, 1);
          updateLocalStorage();
        }
      });
      updateAmount();
    } //clear-completed eventListener


    if (e.target.classList.contains('todo__footer-btn')) {
      clearCompleted();
    } //filter-all eventListener


    if (e.target.classList.contains('todo__filter-text_all')) {
      if (e.target.classList.contains('todo__filter-text_active')) {
        return;
      } else {
        document.querySelector('.todo__filter-text_active').classList.remove('todo__filter-text_active');
        e.target.classList.add('todo__filter-text_active');
        todoListSettings.forEach(function (item) {
          var currentItem = document.querySelector("[data-id=".concat(item.id, "]"));
          currentItem.style.display = '';
        });
      }
    } //filter-active eventListener


    if (e.target.classList.contains('todo__filter-text_not-done')) {
      activeDoneFilters(e.target);
    } //filter-done eventListener


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
  };
}();

document.body.addEventListener('keydown', todoApp.keyDownHandler);
todoApp.todoBody.addEventListener('click', todoApp.todoItemHandler);
todoApp.inputArrow.addEventListener('click', todoApp.selectAllItems);
todoApp.todoBody.addEventListener('dblclick', todoApp.activateEditingField);
document.body.addEventListener('click', function (e) {
  if (!e.target.classList.contains('todo__item-edit')) {
    todoApp.completionOfEditing();
  }
});
},{}],"../../user/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55487" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../user/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map