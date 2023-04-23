const express = require('express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const fs = require('fs');
const dataPath = './db.json';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const saveTodoData = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}
const getTodosData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
}

const memoryStore = new session.MemoryStore();


app.use(
    session({
        secret: 'm1Bt9hp6YtYyvNRY3Ib3bKzpsGAaYLn0',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    }) 
);

const keycloak = new Keycloak({store: memoryStore});

app.use(keycloak.middleware());

app.get('/todos',keycloak.protect(), function (req, res) {
    res.json(getTodosData().todos);
});

app.post('/todos', keycloak.protect(), function(req, res) {
    const db = getTodosData();
    const lastAddedId = db && db.todos && db.todos.length && db.todos[db.todos.length - 1] && db.todos[db.todos.length - 1].id;
    let idToAdd = lastAddedId ? lastAddedId + 1 : 1;
    const newTodo = {
        id: idToAdd,
        title: req.body.title,
        done: req.body.done
    }
    db.todos.push(newTodo);
    saveTodoData(db);
    res.json(newTodo);
});

app.put('/todos/:id',keycloak.protect(), (req, res) => {
    let db = getTodosData();
    const todoId = parseInt(req.params['id']);
    if (!isNaN(todoId)) {
        const todoToEditIndex = db && db.todos && db.todos.length && db.todos.findIndex((todo) => todo.id === todoId );

        if (todoToEditIndex > -1) {
            db.todos[todoToEditIndex] = {
                id: todoId,
                title: req.body.title,
                done: req.body.done
            }
            saveTodoData(db);
            res.json(db.todos[todoToEditIndex]);
        } else {
            res.status(400).json({errMsg:`todo with id ${todoId} not existing`});
        }
    } else {
        res.status(400).json({errMsg:`id params should be a number`});
    }
});

app.delete('/todos/:id',keycloak.protect(),(req, res) => {
    let db = getTodosData();
    const todoId = parseInt(req.params['id']);
    if (!isNaN(todoId)) {
        const todoToEditIndex = db && db.todos && db.todos.length && db.todos.findIndex((todo) => todo.id === todoId );

        if (todoToEditIndex > -1) {
            db.todos.splice(todoToEditIndex, 1);
            saveTodoData(db);
            res.json({});
        } else {
            res.status(400).json({errMsg:`todo with id ${todoId} not existing`});
        }
    } else {
        res.status(400).json({errMsg:`id params should be a number`});
    }
});

app.listen(3000, function () {
    console.log('Listening at port:3000');
})