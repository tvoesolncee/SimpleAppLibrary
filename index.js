const app = document.getElementById('app');

class Http {
    static get(path, data = null) {
        return Http._request('GET', path, data);
    }

    static post(path, data = null) {
        return Http._request('POST', path, data);
    }

    static delete(path, data = null) {
        return Http._request('DELETE', path, data);
    }

    static _request(method, path, data) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',

            },
            mode: 'cors',
            credentials: 'include'
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        /* http://localhost:8002/ */
        /* https://tvoesolncee-library.herokuapp.com/ */
        return fetch(`https://tvoesolncee-library.herokuapp.com/${path}`, options)
            .then(resp => {
                if (!resp.ok) {
                    throw resp.json();
                }
                return resp.json();
            })
            .catch(async responseError => {
                const err = await responseError.then(error => {
                    return error;
                });
                console.log(err);
                return Promise.reject(err)
            });
    }

}

function createStartPage() {
    Http.get('me')
        .then(({email}) => {
            app.innerHTML = '';
            createLibrary();
        })
        .catch(error => {
            console.log(error);
        });

    app.classList.remove('_theme');

    const regSection = document.createElement('section');
    regSection.dataset.sectionName = 'registration';
    regSection.classList.add('regSection');

    const regHead = document.createElement('h2');
    regHead.textContent = 'Registration';
    regSection.append(regHead);

    const regForm = document.createElement('form');
    regForm.classList.add('regform');
    regForm.setAttribute('name', 'person');
    regForm.setAttribute('id', 'person');

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

    const gender = document.createElement('strong');
    gender.textContent = 'Choose Your Gender';
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
    sendButton.classList.add('regform__button');
    regForm.append(sendButton);

    regSection.append(regForm);

    const alreadyRegistered = document.createElement('a');
    alreadyRegistered.href = 'login';
    alreadyRegistered.dataset.href = 'login';
    alreadyRegistered.classList.add('login');
    alreadyRegistered.textContent = 'Already have an account? Log in.';
    regSection.append(alreadyRegistered);

    app.append(regSection);

    alreadyRegistered.addEventListener('click', (event) => {
        event.preventDefault();
        app.innerHTML = '';
        createLoginPage();
    });

    const error = document.createElement('span');
    error.classList.add('error');

    regForm.addEventListener('submit', event => {

        event.preventDefault();

        const userData = {
            email: regForm.mail.value,
            password: regForm.passw.value,
            gender: regForm.gender.value
        };

        Http.post('signup', userData)
            .then(response => {
                app.innerHTML = '';
                createLibrary();
            })
            .catch(response => {
                console.log(response);
                error.textContent = response.error;
                app.prepend(error);
            })
    });
}

createStartPage();

function createLoginPage() {
    const loginSection = document.createElement('section');
    loginSection.dataset.sectionName = 'login';
    loginSection.classList.add('regSection');

    const regHead = document.createElement('h2');
    regHead.textContent = 'Log in';
    loginSection.append(regHead);

    const regForm = document.createElement('form');
    regForm.classList.add('regform');
    regForm.setAttribute('name', 'user');

    const email = document.createElement('input');
    email.setAttribute('type', 'email');
    email.setAttribute('name', 'mail');
    email.setAttribute('placeholder', 'Enter Your Email');
    regForm.append(email);

    const password = document.createElement('input');
    password.setAttribute('type', 'password');
    password.setAttribute('name', 'passw');
    password.classList.add('regform__password');
    password.setAttribute('placeholder', 'Enter Your Password');
    regForm.append(password);

    const sendButton = document.createElement('input');
    sendButton.setAttribute('type', 'submit');
    sendButton.setAttribute('value', 'Send');
    sendButton.classList.add('regform__button');
    regForm.append(sendButton);

    loginSection.append(regForm);

    const notRegistered = document.createElement('a');
    notRegistered.href = 'signup';
    notRegistered.dataset.href = 'signup';
    notRegistered.classList.add('signup');
    notRegistered.textContent = 'I don`t have an account. Sign up.';

    loginSection.append(notRegistered);
    app.append(loginSection);

    const error = document.createElement('span');
    error.classList.add('error');

    regForm.addEventListener('submit', (event) => {

        event.preventDefault();

        let form = document.user;
        console.log(form);

        const userData = {
            email: regForm.mail.value,
            password: regForm.passw.value
        };

        console.log(userData);

        Http.post('login', userData)
            .then(() => {
                app.innerHTML = '';
                createLibrary();
            })
            .catch(response => {
                console.log(response);
                error.textContent = response.error;
                app.prepend(error);
            })
    });
}

function createMenu() {
    const name = document.createElement('h2');
    name.textContent = 'СПИСОК КНИГ';

    const menuSection = document.createElement('section');
    menuSection.dataset.sectionName = 'menu';

    const main = document.createElement('div');
    main.classList.add('menu');

    const titles = {
        theme: 'Сменить тему',
        exit: 'Выйти'
    };

    Object.entries(titles).forEach(function (entry) {
        const href = entry[0];
        const title = entry[1];

        const a = document.createElement('a');
        a.href = href;
        a.dataset.href = href;
        a.textContent = title;
        a.classList.add('menu__link');
        if (href === 'theme') {
            a.classList.add('_changetheme');
        }

        main.append(a);
    });

    menuSection.append(main);

    const userMail = document.createElement('div');
    userMail.classList.add('menu__user');

    if (app.classList.contains('_theme')) {
        name.classList.add('_theme');
        main.classList.add('_theme');
        menuSection.classList.add('_theme');
        userMail.classList.add('_theme');
    }

    Http.get('me')
        .then(user => {
            userMail.textContent = `Пользователь: ${user}`;
            menuSection.append(userMail);
            app.prepend(menuSection);
            app.prepend(name);
        })
        .catch(error => {
            console.log(error);
        });
}

function createAddBookPage() {
    const newBook = document.createElement('form');
    newBook.classList.add('form');
    newBook.classList.add('newbook');
    newBook.setAttribute('name', 'book');
    newBook.setAttribute('id', 'book');

    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('maxlength', '100');
    title.setAttribute('name', 'title');
    title.setAttribute('placeholder', 'Название');
    newBook.append(title);

    const year = document.createElement('input');
    year.setAttribute('type', 'number');
    year.setAttribute('max', '2020');
    year.setAttribute('name', 'year');
    year.setAttribute('placeholder', 'Год издания');
    newBook.append(year);

    const comment = document.createElement('input');
    comment.setAttribute('type', 'text');
    comment.setAttribute('maxlength', '100');
    comment.setAttribute('name', 'comment');
    comment.setAttribute('placeholder', 'Автор книги');
    newBook.append(comment);

    const sendButton = document.createElement('button');
    sendButton.setAttribute('type', 'submit');
    sendButton.setAttribute('value', 'Send');
    sendButton.textContent = 'Отправить';
    sendButton.classList.add('form__button');
    newBook.append(sendButton);

    app.append(newBook);

    const error = document.createElement('span');
    error.classList.add('error');

    newBook.addEventListener('submit', (event) => {
        event.preventDefault();

        const bookData = {
            title: newBook.title.value,
            year: newBook.year.value,
            info: newBook.comment.value
        };

        Http.post('books', bookData)
            .then(() => {
                app.innerHTML = '';
                createLibrary();
            })
            .catch(response => {
                console.log(response);
                error.textContent = response.error;
                app.prepend(error);
            });
    });

    const a = document.createElement('a');
    a.classList.add('link__back');
    a.href = `back`;
    a.dataset.href = `back`;
    a.textContent = `Назад`;
    app.append(a);

    checkTheme();
}

function deleteBook(id) {
    const error = document.createElement('span');
    error.classList.add('error');

    const data = {
        id: id
    };

    Http.delete('books/delete', data)
        .then(() => {
            app.innerHTML = '';
            createLibrary();
        })
        .catch(response => {
            console.log(response);
            error.textContent = response.error;
            app.prepend(error);
        })
}

function createLibrary() {
    const library = document.createElement('section');
    library.dataset.sectionName = 'library';
    library.classList.add('library');

    const a = document.createElement('a');
    a.href = `addbook`;
    a.dataset.href = `addbook`;
    a.textContent = `Добавить книгу`;
    a.classList.add('library__add');

    const ul = document.createElement('ul');
    ul.classList.add('library__list');

    const error = document.createElement('span');
    error.classList.add('error');

    Http.get('books')
        .then(response => {
            response.books.map(book => {
                let li = document.createElement('li');
                const a = document.createElement('a');
                a.href = 'book';
                a.textContent = `${book.title}`;
                a.classList.add('library__book');
                a.setAttribute('information', JSON.stringify(book));
                li.append(a);

                const del = document.createElement('button');
                del.textContent = 'x';
                del.classList.add('library__del');
                li.prepend(del);

                ul.append(li);

                if (app.classList.contains('_theme')) {
                    li.classList.add('_theme');
                    a.classList.add('_theme');
                    del.classList.add('_theme');
                }

                del.addEventListener('click', (event) => {
                    event.preventDefault();
                    deleteBook(book.id);
                });
            })
        })
        .catch(response => {
            console.log(response);
            error.textContent = response.error;
            app.prepend(error);
        });

    library.append(ul);
    createMenu();
    library.prepend(a);
    app.append(library);
    if (app.classList.contains('_theme')) {
        library.classList.add('_theme');
        ul.classList.add('_theme');
    }
}

function createBookPage(bookString) {
    let bookPage = document.createElement('div');
    bookPage.classList.add('book');

    let book = JSON.parse(bookString);
    const header = document.createElement('h1');
    header.classList.add('book__header');
    header.textContent = book.title;
    const year = document.createElement('div');
    year.classList.add('book__year');
    year.textContent = `Год: ${book.year}`;
    const comment = document.createElement('div');
    comment.classList.add('book__info');
    comment.textContent = `Автор: ${book.info}`;
    bookPage.append(header);
    bookPage.append(year);
    bookPage.append(comment);

    const editBook = document.createElement('a');
    editBook.href = `edit`;
    editBook.dataset.href = `edit`;
    editBook.textContent = `Изменить`;
    editBook.classList.add('editlink');
    bookPage.append(editBook);
    bookPage.append(document.createElement('br'));

    editBook.addEventListener('click', (event) => {
        event.preventDefault();
        app.innerHTML = '';
        createEditBookPage(book);
    });

    app.append(bookPage);

    const a = document.createElement('a');
    a.classList.add('link__back');
    a.href = `back`;
    a.dataset.href = `back`;
    a.textContent = `Назад`;
    app.append(a);
    checkTheme();
}

function createEditBookPage(book) {
    const editBook = document.createElement('form');
    editBook.classList.add('form');
    editBook.setAttribute('name', 'editor');
    editBook.setAttribute('id', 'book');

    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('name', 'title');
    title.setAttribute('value', `${book.title}`);
    editBook.append(title);

    const year = document.createElement('input');
    year.setAttribute('type', 'number');
    year.setAttribute('max', '2020');
    year.setAttribute('name', 'year');
    year.setAttribute('value', `${book.year}`);
    editBook.append(year);

    const comment = document.createElement('input');
    comment.setAttribute('type', 'text');
    comment.setAttribute('name', 'comment');
    comment.setAttribute('value', `${book.info}`);
    editBook.append(comment);

    const sendButton = document.createElement('button');
    sendButton.setAttribute('type', 'submit');
    sendButton.setAttribute('value', 'Send');
    sendButton.classList.add('form__button');
    sendButton.textContent = 'Отправить';
    editBook.append(sendButton);

    app.append(editBook);

    const error = document.createElement('span');
    error.classList.add('error');

    editBook.addEventListener('submit', (event) => {
        event.preventDefault();

        const bookData = {
            id: book.id,
            title: editBook.title.value,
            year: editBook.year.value,
            info: editBook.comment.value
        };

        Http.post('books/edit', bookData)
            .then(() => {
                app.innerHTML = '';
                createLibrary();
            })
            .catch(response => {
                console.log(response);
                error.textContent = response.error;
                app.prepend(error);
            });

    });

    const a = document.createElement('a');
    a.classList.add('link__back');
    a.href = `back`;
    a.dataset.href = `back`;
    a.textContent = `Назад`;
    app.append(a);

    checkTheme();
}

function exit() {
    Http.post('logout')
        .then(() => {
            app.innerHTML = '';
            createStartPage();
        });
}

function changeTheme() {
    app.classList.toggle('_theme');

    const menuItemsToChangeTheme = document.querySelectorAll('h2, section, .menu, .menu *, .menu__user, .library, .library *');
    menuItemsToChangeTheme.forEach(item => {
        item.classList.toggle('_theme');
    })
}

function checkTheme() {
    if (app.classList.contains('_theme')) {
        const itemsToChange = document.querySelectorAll('.app *:not(input)');

        itemsToChange.forEach(item => {
            item.classList.toggle('_theme');
        });
    }
}

const pages = {
    login: createLoginPage,
    back: createLibrary,
    addbook: createAddBookPage,
    exit: exit,
    signup: createStartPage
};

app.addEventListener('click', (event) => {

    if (event.target instanceof HTMLInputElement && event.target.classList.contains('newbook')) {
        event.preventDefault();
        app.innerHTML = '';
        createLibrary();
        return;
    }

    if (!(event.target instanceof HTMLAnchorElement)) {
        return;
    }

    if (event.target.classList.contains('_changetheme')) {
        event.preventDefault();
        changeTheme();
        return;
    }

    if (event.target.className === 'library__link' || event.target.classList.contains('editlink')) {
        event.preventDefault();
        console.log('!!!!!!!!!!');
        return;
    }

    if (event.target.classList.contains('library__book')) {
        event.preventDefault();
        app.innerHTML = '';
        createBookPage(event.target.getAttribute('information'));
        return;
    }

    event.preventDefault();

    app.innerHTML = '';
    pages[event.target.dataset.href]();

});
