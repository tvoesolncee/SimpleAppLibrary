const express = require('express');
const body = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const uuid = require('uuid/v4');

class App {
    constructor() {
        this.app = express();
        this.app.use(body.json());
        this.app.use(cors({
            origin: 'https://tvoesolncee-library-front.herokuapp.com',
            credentials: true
        }));
        this.app.use(cookieParser());
        this.startRoutes();
        this.port = process.env.PORT || 8002;
        this.app.listen(this.port, () => {
            console.log(`Server listening port ${this.port}`)
        });
    }

    startRoutes() {
        this.app.post('/signup', this.signUpController);

        this.app.get('/me', this.getUserController);

        this.app.post('/login', this.logInController);

        this.app.post('/logout', this.logOutController);

        this.app.get('/books', this.getBooksController);

        this.app.post('/books', this.addBookController);

        this.app.post('/books/edit', this.editBookController);

        this.app.delete('/books/delete', this.deleteBookController);
    }

    signUpController = (req, res) => {
        const {email, password, gender} = req.body;
        const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !email.match(validEmail) ||
            !password || password.length <= 4 ||
            !gender) {
            return res.status(400).json({error: 'Не валидные данные пользователя.'});
        }
        if (Array.from(users.keys()).includes(email)) {
            return res.status(400).json({error: 'Пользователь с таким e-mail уже зарегистрирован.'});
        }
        const user = {email, password, gender};
        users.set(email, user);
        const sessionid = uuid();
        sessions.set(sessionid, email);
        res.cookie('sessionid', sessionid, {expires: new Date(Date.now() + 3600 * 1000)});
        res.status(201).json(user);
    };

    getUserController = (req, res) => {
        if (!req.cookies['sessionid']) {
            return res.status(401).json({error: 'Пользователь не авторизован.'});
        }
        const sessionid = req.cookies['sessionid'];
        const email = sessions.get(sessionid);
        const user = users.get(email).email;
        res.status(200).json(user);
    };

    logInController = (req, res) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error: 'Не указан e-mail и/или пароль.'});
        }
        if (!users.has(email) || users.get(email).password !== password) {
            return res.status(400).json({error: 'Неверный e-mail и/или пароль.'});
        }
        const sessionid = uuid();
        sessions.set(sessionid, email);
        res.cookie('sessionid', sessionid, {expires: new Date(Date.now() + 3600 * 1000)});
        res.status(200).json({status: 'ok'});
    };

    logOutController = (req, res) => {
        const sessionid = req.cookies['sessionid'];
        sessions.delete(sessionid);
        res.clearCookie('sessionid');
        res.status(200).json({status: 'ok'});
    };

    getBooksController = (req, res) => {
        if (!req.cookies['sessionid']) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы просмотреть список дел.'});
        }
        res.status(200).json({books: Array.from(books.values())});
    };

    addBookController = (req, res) => {
        if (!req.cookies['sessionid']) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы добавить новую книгу.'});
        }
        const {title, year, info} = req.body;
        if (!title || !year || !info) {
            return res.status(400).json({error: 'Введите информацию'});
        }
        const id = uuid();
        const book = {id, title, year, info};
        console.log(book);
        books.set(id, book);
        res.status(201).json(book);
    };

    editBookController = (req, res) => {
        if (!req.cookies['sessionid']) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы добавить новую книгу.'});
        }
        const {id, title, year, info} = req.body;
        if (!title || !year || !info) {
            return res.status(400).json({error: 'Введите информацию'});
        }
        const book = {id, title, year, info};
        books.delete(id);
        books.set(id, book);
        res.status(201).json(book);
    };

    deleteBookController = (req, res) => {
        if (!req.cookies['sessionid']) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы редактировать список дел.'});
        }
        const {id} = req.body;
        console.log(id);
        const book = books.get(id);
        //console.log(book);
        console.log(id);
        books.delete(id);
        //console.log(books);
        res.status(201).json(book);
    };
}

new App();

const users = new Map([
    ['user@user.com', {
        email: 'user@user.com',
        password: '1234',
        gender: 'man',
    }]
]);

const sessions = new Map([]);

const books = new Map([
    [1, {id: 1, title: 'Анна Каренина', year: 1873, info: 'Лев Толстой'}],
    [2, {id: 2, title: 'Маленький принц', year: 1942, info: 'Антуан де Сент Экзюпери'}],
    [3, {id: 3, title: 'Алые паруса', year: 1923, info: 'Александр Грин'}]
]);


