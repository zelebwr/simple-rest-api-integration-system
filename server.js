const express = require('express');
const app = express();
// const app = require('express')();
const port = 3000; 

app.use(express.json());

let todos = []; 
let idCounter = 1; 

function parseNumericTodoId(rawId) {
    if (!/^\d+$/.test(rawId)) {
        return null;
    }

    return Number.parseInt(rawId, 10);
}

app.get('/', (req,res) => {
    const todo = todos.map(todo => ({ id: todo.id, title: todo.title }));
    res.status(200).json(todo);
});

app.post('/', (req, res) => {
    const { title, description } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is missing. Please add a title for the task.'});
    }

    const newTodo = {
        id: idCounter++,
        title: title.trim(),
        description: typeof description === 'string' ? description.trim() : '',
        completed: false
    }

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.get('/:id', (req, res) => {
    const todoId = parseNumericTodoId(req.params.id);

    if (todoId === null) {
        return res.status(400).json({ error: 'Invalid todo id. Only numeric id is allowed.' });
    }

    const todo = todos.find(todoItem => todoItem.id === todoId);

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found.' });
    }
    res.status(200).json(todo);
});

app.put('/:id', (req, res) => {
    const todoId = parseNumericTodoId(req.params.id);
    const { title, description, completed } = req.body;

    if (todoId === null) {
        return res.status(400).json({ error: 'Invalid todo id. Only numeric id is allowed.' });
    }

    const todo = todos.find(todoItem => todoItem.id === todoId);

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found.' });
    }

    Object.assign(todo, {
        ...(typeof title === 'string' && { title: title.trim() }),
        ...(typeof description === 'string' && { description: description.trim() }),
        ...(typeof completed === 'boolean' && { completed })
    });

    res.status(200).json(todo); 
});

app.delete('/:id', (req, res) => {
    const todoId = parseNumericTodoId(req.params.id);

    if (todoId === null) {
        return res.status(400).json({ error: 'Invalid todo id. Only numeric id is allowed.' });
    }

    const todo = todos.find(todoItem => todoItem.id === todoId);

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found.' });
    }

    todos = todos.filter(todoItem => todoItem.id !== todoId);
    res.status(204).send(); 
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});