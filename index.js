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
            //origin: 'https://tvoesolncee-library-front.herokuapp.com',
            origin: 'http://localhost:63342',
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

        const books = new Map();

        const user = {email, password, gender, books};
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
        const sessionid = req.cookies['sessionid'];
        if (!sessionid) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы просмотреть список книг.'});
        }

        const email = sessions.get(sessionid);
        const user = users.get(email);

        res.status(200).json({books: Array.from(user.books.values())});
    };

    addBookController = (req, res) => {
        const sessionid = req.cookies['sessionid'];
        if (!sessionid) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы добавить новую книгу.'});
        }

        const email = sessions.get(sessionid);
        const user = users.get(email);

        const {title, year, info, description} = req.body;
        if (!title || !year || !info || !description) {
            return res.status(400).json({error: 'Все поля обязательны'});
        }

        const id = uuid();
        const book = {id, title, year, info, description};
        user.books.set(id, book);

        users.set(email, user);

        res.status(201).json(book);
    };

    editBookController = (req, res) => {
        const sessionid = req.cookies['sessionid'];
        if (!sessionid) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы добавить новую книгу.'});
        }

        const {id, title, year, info, description} = req.body;
        if (!title || !year || !info || !description) {
            return res.status(400).json({error: 'Все поля обязательны'});
        }

        const email = sessions.get(sessionid);
        const user = users.get(email);
        const book = {id, title, year, info, description};

        user.books.delete(id);
        user.books.set(id, book);

        users.set(email, user);

        res.status(201).json(book);

    };

    deleteBookController = (req, res) => {
        const sessionid = req.cookies['sessionid'];

        if (!sessionid) {
            return res.status(403).json({error: 'Авторизуйтесь, чтобы редактировать список книг.'});
        }
        const {id} = req.body;

        const email = sessions.get(sessionid);
        const user = users.get(email);

        const book = user.books.get(id);
        user.books.delete(id);

        users.set(email, user);

        res.status(201).json(book);
    };
}

new App();

const users = new Map([
    ['user@user.com', {
        email: 'user@user.com',
        password: '1234',
        gender: 'man',
        books: new Map([
            [1, {id: 1, title: 'Анна Каренина', year: 1873, info: 'Лев Толстой', description: 'Роман Льва Толстого о трагической любви замужней дамы Анны Карениной и блестящего офицера Вронского на фоне счастливой семейной жизни дворян Константина Лёвина и Кити Щербацкой. Масштабная картина нравов и быта дворянской среды Петербурга и Москвы второй половины XIX века, сочетающая философские размышления авторского alter ego Лёвина с передовыми в русской литературе психологическими зарисовками, а также сценами из жизни крестьян.'}],
            [2, {id: 2, title: 'Маленький принц', year: 1942, info: 'Антуан де Сент Экзюпери', description: 'Аллегорическая повесть-сказка, наиболее известное произведение Антуана де Сент-Экзюпери. Сказка рассказывает о Маленьком принце, который посещает различные планеты в космосе, включая Землю.'}],
            [3, {id: 3, title: 'Алые паруса', year: 1923, info: 'Александр Грин', description: 'Повесть-феерия Александра Грина о непоколебимой вере и всепобеждающей, возвышенной мечте, о том, что каждый может сделать для близкого чудо.'}],
            [4, {id: 4, title: 'Самая красивая женщина в городе', year: 1983, info: 'Чарльз Буковски', description: 'Сборник рассказов американского поэта и писателя контркультуры Чарльза Буковски.'}]
        ]),
    }]
]);

const sessions = new Map([]);



