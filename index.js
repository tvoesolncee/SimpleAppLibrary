const app = document.getElementById('app');

// TODO create HTTP service, добавить get, post (посмотреть на Angular http client)
function ajax(method, path, id = '') {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        mode: 'cors',
        params: id
    };

    return fetch(`http://localhost:8002/${path}` + id, options)
        .then(resp => resp.json());
}

function sendData(method, path, userData) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        mode: 'cors',
        body: JSON.stringify(userData),
    };
    console.log('sendData');
    return fetch(`http://localhost:8002/${path}`, options)
        .then(resp => resp.json());
}
function createStartPage() {

    const regSection = document.createElement('section');
    regSection.dataset.sectionName = 'registration';
    regSection.classList.add('regSection');

    const regHead = document.createTextNode('Registration');
    regSection.append(regHead);

    const regForm = document.createElement('form');
    regForm.classList.add('regForm');
    regForm.setAttribute('name', 'person');
    regForm.setAttribute('id', 'person');
    regForm.setAttribute('action', 'signup');
    regForm.setAttribute('method', 'POST');

    const email = document.createElement('input');
    email.setAttribute('type', 'email');
    email.setAttribute('name', 'mail');
    email.setAttribute('placeholder', 'Your Email');
    regForm.append(email);

    const password = document.createElement('input');
    password.setAttribute('type', 'password');
    password.setAttribute('name', 'passw');
    password.setAttribute('placeholder', 'Enter Your Password');
    regForm.append(password);

    const gender = document.createTextNode('Choose Your Gender');
    regForm.append(gender);

    const genderInputMan = document.createElement('input');
    genderInputMan.setAttribute('type', 'radio');
    genderInputMan.setAttribute('value', 'Man');
    genderInputMan.setAttribute('name', 'gender');
    genderInputMan.setAttribute('checked', '');
    genderInputMan.setAttribute('id', 'man');

    const labelMan = document.createElement('label');
    labelMan.setAttribute('for', 'man');
    labelMan.textContent = 'Man';

    const chooseMan = document.createElement('div');
    chooseMan.append(genderInputMan);
    chooseMan.append(labelMan);
    regForm.append(chooseMan);

    const genderInputWoman = document.createElement('input');
    genderInputWoman.setAttribute('type', 'radio');
    genderInputWoman.setAttribute('value', 'Woman');
    genderInputWoman.setAttribute('name', 'gender');
    genderInputWoman.setAttribute('id', 'woman');

    const labelWoman = document.createElement('label');
    labelWoman.setAttribute('for', 'woman');
    labelWoman.textContent = 'Woman';

    const chooseWoman = document.createElement('div');
    chooseWoman.append(genderInputWoman);
    chooseWoman.append(labelWoman);
    regForm.append(chooseWoman);

    const sendButton = document.createElement('input');
    sendButton.setAttribute('type', 'submit');
    sendButton.setAttribute('value', 'Send');
    regForm.append(sendButton);

    regSection.append(regForm);

    const alreadyRegistered = document.createElement('a');
    alreadyRegistered.href = 'login';
    alreadyRegistered.dataset.href = 'login';
    alreadyRegistered.textContent = 'Already have an account? Log in.';
    regSection.append(alreadyRegistered);

    app.append(regSection);
}

//createStartPage();

function createLoginPage() {
    const loginSection = document.createElement('section');
    loginSection.dataset.sectionName = 'login';
    loginSection.classList.add('regSection');

    const regHead = document.createTextNode('Log in');
    loginSection.append(regHead);

    const regForm = document.createElement('form');
    regForm.classList.add('regForm');
    regForm.setAttribute('name', 'user');

    const email = document.createElement('input');
    email.setAttribute('type', 'email');
    email.setAttribute('name', 'mail');
    email.setAttribute('placeholder', 'Enter Your Email');
    regForm.append(email);

    const password = document.createElement('input');
    password.setAttribute('type', 'password');
    password.setAttribute('name', 'passw');
    password.setAttribute('placeholder', 'Enter Your Password');
    regForm.append(password);

    const sendButton = document.createElement('input');
    sendButton.setAttribute('type', 'submit');
    sendButton.setAttribute('value', 'Send');
    regForm.append(sendButton);

    loginSection.append(regForm);
    app.append(loginSection);
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
        library: 'Библиотека',
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

function createAddBookPage() {
    const newBook = document.createElement('form');
    newBook.classList.add('form');
    newBook.setAttribute('name', 'book');
    newBook.setAttribute('id', 'book');
    newBook.setAttribute('action', 'signup');
    newBook.setAttribute('method', 'POST');

    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('name', 'title');
    title.setAttribute('placeholder', 'Book Title');
    newBook.append(title);

    const year = document.createElement('input');
    year.setAttribute('type', 'text');
    year.setAttribute('name', 'year');
    year.setAttribute('placeholder', 'Book year');
    newBook.append(year);

    const comment = document.createElement('input');
    comment.setAttribute('type', 'text');
    comment.setAttribute('name', 'comment');
    comment.setAttribute('placeholder', 'Book comment');
    newBook.append(comment);

    app.append(newBook);

    const a = document.createElement('a');
    a.href = `back`;
    a.dataset.href = `back`;
    a.textContent = `Go back`;
    app.append(a);
}

createMenu();

function deleteBook(id) {
    ajax('DELETE', 'books', id)
        .then(console.log('done'));
    //app.innerHTML = '';
    //createLibrary();

}

function createLibrary() {
    const library = document.createElement('section');
    library.dataset.sectionName = 'library';
    library.classList.add('library');

    const ul = document.createElement('ul');

    ajax('GET', 'books')
        .then(books => {
            console.log(books);
            books.map(book => {
                console.log(book);
                let li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `${book.title}`;
                a.dataset.href = `${book.title}`;
                a.textContent = `${book.title}`;
                a.classList.add('library__book');
                a.setAttribute('information', JSON.stringify(book));
                li.append(a);

                const del = document.createElement('a');
                del.href = `delete`;
                del.textContent = 'DELETE';
                del.classList.add('library__link');
                del.setAttribute('onclick', `deleteBook(${book.id});`);
                li.append(del);

                ul.append(li);
            })
        });

    library.append(ul);
    createMenu();
    app.append(library);

    const a = document.createElement('a');
    a.href = `addbook`;
    a.dataset.href = `addbook`;
    a.textContent = `Добавить книгу`;
    app.append(a);
}

function createBookPage(bookString) {
    let book = JSON.parse(bookString);
    const header = document.createElement('h1');
    header.textContent = book.title;
    const year = document.createElement('div');
    year.textContent = `Year: ${book.year}`;
    const comment = document.createElement('div');
    comment.textContent = `Comment: ${book.info}`;
    app.append(header);
    app.append(year);
    app.append(comment);

    const a = document.createElement('a');
    a.href = `back`;
    a.dataset.href = `back`;
    a.textContent = `Go back`;
    app.append(a);
}

const pages = {
    users: createUserPage,
    phrase: createPhrasesPage,
    menu: createMenu,
    login: createLoginPage,
    library: createLibrary,
    back: createLibrary,
    addbook: createAddBookPage
};
/*
const regForm = document.person;
regForm.addEventListener('submit', (event) => {

    event.preventDefault();

    let form = document.person;
    console.log(form);

    let userData = {};
    userData.mail = form.mail.value;
    userData.passw = form.passw.value;
    userData.gender = form.gender.value;

    console.log(userData);

    sendData('POST', 'signup', userData)
        .then(user => console.log(user));

    app.innerHTML = '';
    createMenu();
});

const loginForm = document.user;
loginForm.addEventListener('submit', (event) => {

    event.preventDefault();

    let form = document.user;
    console.log(form);

    let userData = {};
    userData.mail = form.mail.value;
    userData.passw = form.passw.value;

    console.log(userData);

    sendData('POST', 'login', userData)
        .then(user => console.log(user));
});

 */

app.addEventListener('click', (event) => {

    if (!(event.target instanceof HTMLAnchorElement)) {
        return;
    }

    if (event.target.className === 'library__link') {
        event.preventDefault();
        return;
    }

    if (event.target.className === 'library__book') {
        event.preventDefault();
        app.innerHTML = '';
        createBookPage(event.target.getAttribute('information'));
        return;
        /*
                event.preventDefault();
                let bookInfo = document.createElement('div');
                bookInfo.append('information');
                event.target.after(bookInfo);
                return;
         */
    }

    event.preventDefault();

    app.innerHTML = '';
    pages[event.target.dataset.href]();

});
