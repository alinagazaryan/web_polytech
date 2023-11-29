function createAuthorElement(record) {
    let user = record.user || { 'name': { 'first': '', 'last': '' } };
    let authorElement = document.createElement('div');
    authorElement.classList.add('author-name');
    authorElement.innerHTML = user.name.first + ' ' + user.name.last;
    return authorElement;
}

function createUpvotesElement(record) {
    let upvotesElement = document.createElement('div');
    upvotesElement.classList.add('upvotes');
    upvotesElement.innerHTML = record.upvotes;
    return upvotesElement;
}

function createFooterElement(record) {
    let footerElement = document.createElement('div');
    footerElement.classList.add('item-footer');
    footerElement.append(createAuthorElement(record));
    footerElement.append(createUpvotesElement(record));
    return footerElement;
}

function createContentElement(record) {
    let contentElement = document.createElement('div');
    contentElement.classList.add('item-content');
    contentElement.innerHTML = record.text;
    return contentElement;
}

function createListItemElement(record) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('facts-list-item');
    itemElement.append(createContentElement(record));
    itemElement.append(createFooterElement(record));
    return itemElement;
}

function renderRecords(records) {
    let factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    for (let i = 0; i < records.length; i++) {
        factsList.append(createListItemElement(records[i]));
    }
}

function setPaginationInfo(info) {
    document.querySelector('.total-count').innerHTML = info.total_count;
    let start = info.total_count && (info.current_page - 1) * info.per_page + 1;
    document.querySelector('.current-interval-start').innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector('.current-interval-end').innerHTML = end;
}

function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    for (cls of classes) {
        btn.classList.add(cls);
    }
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}

function renderPaginationElement(info) {
    let btn;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        btn = createPageBtn(i, i == info.current_page ? ['active'] : []);
        buttonsContainer.append(btn);
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
}

function downloadData(page = 1, searchQuery = '') {
    let factsList = document.querySelector('.facts-list');
    let url = new URL(factsList.dataset.url);
    let perPage = document.querySelector('.per-page-btn').value;
    url.searchParams.append('page', page);
    url.searchParams.append('per-page', perPage);
    if (searchQuery) {
        url.searchParams.append('q', searchQuery);
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    };
    xhr.send();
}

function searchFormHandler(event) {
    event.preventDefault();
    let searchInput = document.querySelector('.search-input');
    let searchQuery = searchInput.value.trim();
    downloadData(1, searchQuery);
}


function perPageBtnHandler(event) {
    downloadData(1);
}

function pageBtnHandler(event) {
    if (event.target.dataset.page) {
        downloadData(event.target.dataset.page);
        window.scrollTo(0, 0);
    }
}
let autocompleteTimer;
window.onload = function () {
    downloadData();
    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('.per-page-btn').onchange = perPageBtnHandler;

    // Добавляем обработчик для формы поиска
    document.querySelector('.search-form').onsubmit = searchFormHandler;

    // Добавляем обработчик для ввода в текстовое поле
    document.querySelector('.search-input').oninput = function (event) {
        // Очищаем предыдущий таймер задержки
        clearTimeout(autocompleteTimer);

        // Задержка перед выполнением запроса для избежания частых запросов
        autocompleteTimer = setTimeout(function () {
            autocomplete(event.target.value);
        }, 300);
    };

    document.querySelector('.search-input').oninput = function () {
        showAutocompleteList();
        // Вызываем функцию autocomplete с текущим значением в поле ввода
        autocomplete(this.value);
    };

    // Добавляем обработчик для клика по варианту автодополнения
    document.querySelector('.autocomplete-list').onclick = function (event) {
        if (event.target.tagName === 'LI') {
            document.querySelector('.search-input').value = event.target.textContent;
            // Очищаем список автодополнения
            document.querySelector('.autocomplete-list').innerHTML = '';
        }
    };

    document.addEventListener('click', function (event) {
        const autocompleteContainer = document.querySelector('.autocomplete-container');
        if (!autocompleteContainer.contains(event.target)) {
            hideAutocompleteList();
        }
    });
};

function showAutocompleteList() {
    document.querySelector('.autocomplete-list').style.display = 'block';
}

function hideAutocompleteList() {
    document.querySelector('.autocomplete-list').style.display = 'none';
}

function autocomplete(query) {
    let autocompleteList = document.querySelector('.autocomplete-list');
    let url = new URL('http://cat-facts-api.std-900.ist.mospolytech.ru/autocomplete'); // Замените на реальный URL для запроса автодополнения
    url.searchParams.append('q', query);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderAutocompleteList(this.response);
    };
    xhr.send();
}

function renderAutocompleteList(options) {
    let autocompleteList = document.querySelector('.autocomplete-list');
    autocompleteList.innerHTML = '';

    if (options.length > 0) {
        options.forEach(function (option) {
            let listItem = document.createElement('li');
            listItem.textContent = option;
            autocompleteList.appendChild(listItem);
        });
    } else {
        autocompleteList.innerHTML = '<div>No suggestions</div>';
    }
}

document.querySelector('.search-btn').onclick = function () {
    let searchInput = document.querySelector('.search-input');
    let searchQuery = searchInput.value.trim();
    downloadData(1, searchQuery);
};   

