const express = require('express');
const app = express();
// const app = require('express')();
const port = 3000; 

app.use(express.json());

let todos = []; 
let idCounter = 1; 

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
        description: description.trim(),
        completed: false
    }

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.get('/:id', (req, res) => {
    const todoId = parseInt(req.params.id, 10);
    const todo = todos.find(todoItem => todoItem.id === todoId);

    if (!todo) {
        return res.status(404).json({ error: 'Todo not found.' });
    }
    res.status(200).json(todo);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});