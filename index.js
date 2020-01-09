const app = document.getElementById('app');

// TODO create HTTP service, добавить get, post (посмотреть на Angular http client)
function ajax(method, path) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        mode: 'cors',
    };

    return fetch(`http://localhost:8002/${path}`, options)
        .then(resp => resp.json());
}


//TODO очень много дублирования кода по созданию элемента - написать для этого класс, который принимает объект с атрибутами, можно добавить методы показать, скрыть, естановить данные, удалить и т.д
function createMenu() {
    const menuSection = document.createElement('section');
    menuSection.dataset.sectionName = 'menu';

    const main = document.createElement('div');
    main.classList.add('menu');

    const titles = {
        menu: 'Закрыть',
        users: 'Пользователи',
        phrase: 'Топ фразы',
    };

    Object.entries(titles).forEach(function (entry) {
        const href = entry[0];
        const title = entry[1];

        const a = document.createElement('a');
        a.href = href;
        a.dataset.href = href;
        a.textContent = title;
        a.classList.add('menu__link');

        main.append(a);
    });

    menuSection.append(main);
    app.append(menuSection);
}

function createUserPage() {
    const userPageSection = document.createElement('section');
    userPageSection.dataset.sectionName = 'users';

    const ul = document.createElement('ul');

    ajax('GET', 'users')
        .then(users => {
            users.forEach(user => {
                let li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = `${user.name}, планета ${user.birthYear}, весит аж ${user.mass}, ростом ${user.height}`;
                li.append(span);
                ul.append(li);
            })
        });

    userPageSection.append(ul);
    createMenu();
    app.append(userPageSection)
}

function createPhrasesPage() {
    const phrasesPageSection = document.createElement('section');
    phrasesPageSection.dataset.sectionName = 'phrase';

    const ul = document.createElement('ul');

    ajax('GET', 'phrases')
        .then(phrases => {
            phrases.map(phrase => {
                let li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = `${phrase.title}`;
                li.append(span);
                ul.append(li);
            })
        });

    phrasesPageSection.append(ul);
    createMenu();
    app.append(phrasesPageSection)
}

const pages = {
    users: createUserPage,
    phrase: createPhrasesPage,
    menu: createMenu,
};

createMenu();

app.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) {
        return;
    }

    event.preventDefault();

    app.innerHTML = '';
    pages[event.target.dataset.href]();
});
