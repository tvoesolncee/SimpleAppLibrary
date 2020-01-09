const express = require('express');
const body = require('body-parser');
const cors = require('cors');

// TODO create es6 class

const app = express();
app.use(body.json());

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


// TODO

//  /signup (post запоминаем пользователя, выставляем куки -> 201 created)
//  /login (если у нас есть пользователь, высталяем куки -> 200)
//  /me (парсим куки - если сессионной куки нет -> 401 Unauthorized, иначе возвращаем пользователя)
//  /logout (сбрасываем куки)

const port = process.env.PORT || 8002;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
