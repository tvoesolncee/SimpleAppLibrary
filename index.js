const express = require('express');
const body = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const uuid = require('uuid/v4');

// TODO create es6 class

const app = express();
app.use(body.json());
app.use(cookieParser());

// TODO build up cors
app.use(cors({origin: '*'}));

const starWarsUser = [
    {
        name: "Luke Skywalker",
        birthYear: "19BBY",
        mass: 77,
        height: 172,
    },
    {
        name: "Leia Organa",
        birthYear: "19BBY",
        mass: 49,
        height: 150,
    },
    {
        name: "C-3PO",
        birthYear: "112BBY",
        mass: 75,
        height: 167,
    }
];

const appUsers = new Map();
const cookieID = new Map();

const books = new Map([
    [1, {id: 1, title: 'book1', year: 1930, info: 'normas kniga'}],
    [2, {id: 2, title: 'book2', year: 1885, info: 'ne nravitsya'}],
    [3, {id: 3, title: 'book3', year: 2000, info: 'wow'}],
]);

const phrases = [
    {
        title: "Красивое лучше, чем уродливое."
    },
    {
        title: "Явное лучше, чем неявное."
    },
    {
        title: "Простое лучше, чем сложное."
    },
    {
        title: "Сложное лучше, чем запутанное."
    },
    {
        title: "Плоское лучше, чем вложенное."
    },
    {
        title: "Читаемость имеет значение."
    },
    {
        title: "При этом практичность важнее безупречности."
    },
    {
        title: "Ошибки никогда не должны замалчиваться."
    },
    {
        title: "Встретив двусмысленность, отбрось искушение угадать."
    },
    {
        title: "Сейчас лучше, чем никогда."
    },
    {
        title: "Сейчас лучше, чем никогда."
    },
    {
        title: "Хотя никогда зачастую лучше, чем прямо сейчас."
    }
];

app.get('/users', function (req, res) {
    res.status(200).json(starWarsUser);
});

app.get('/phrases', function (req, res) {
    res.status(200).json(phrases);
});

app.get('/books', function (req, res) {
    res.status(200).json(Array.from(books.values()));
});

app.delete('/books:id', function (req, res) {
    const id = req.params;
    console.log(id);
    books.delete(id);
    console.log(books);
    res.status(200);
});

// TODO

app.post("/signup", function (req, res) {

    const {mail, passw, gender} = req.body;
    console.log(mail);

    if (!mail || !passw) return res.status(400).json({error: 'error mail/password'});

    const newUser = {mail, passw, gender};
    appUsers.set(mail, newUser);

    const id = uuid();
    cookieID.set(mail, id);
    res.cookie('sessionid', id);

    return res.status(201).json({mail: mail, gender: gender});
});

app.post("/login", function (req, res) {

    const {mail, passw} = req.body;
    const user = {mail, passw};

    if (appUsers.has(mail)) {
        let registeredUser = appUsers.get(mail);
        if (registeredUser.mail === mail && registeredUser.passw === passw) {
            res.cookie("user", user.mail);
            return res.status(200).json(user);
        } else {
            return res.status(400).json({error: 'error mail/password'});
        }
    }
    return res.status(400).json({error: 'no such user'});
});

app.get("/logout", function (req, res) {
    res.clearCookie('user');
    res.send('user logout successfully');
});

app.get("/me", function (req, res) {
    const username = req.cookies['user'];

    if (username) {
        return res.send(username);
    }

    return res.status(401).json({error: 'no cookie'});
});

//  /signup (post запоминаем пользователя, выставляем куки -> 201 created)
//  /login (если у нас есть пользователь, высталяем куки -> 200)
//  /me (парсим куки - если сессионной куки нет -> 401 Unauthorized, иначе возвращаем пользователя)
//  /logout (сбрасываем куки)

const port = process.env.PORT || 8002;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
