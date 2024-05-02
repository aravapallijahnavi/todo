const express = require('express');
const app = express();
const port = 8080;

let tasks = [];  // This array will store your tasks

app.use(express.urlencoded({ extended: true }));  // Middleware to parse POST data

// Route to display the To-Do List and form for adding/removing tasks
app.get('/', (req, res) => {
    let taskListHTML = tasks.map((task, index) => 
        `<li>${task} <button class="remove-btn" onclick="removeTask(${index})">Remove</button></li>`
    ).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>To-Do List</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background: #f4f4f9;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                }
                #todo-container {
                    background: white;
                    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
                    padding: 20px;
                    width: 300px;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    background: #eee;
                    margin-top: 8px;
                    padding: 10px;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                input[type="text"] {
                    width: 70%;
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }
                button {
                    background-color: #5cb85c;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 4px;
                }
                .remove-btn {
                    background-color: #d9534f;
                }
            </style>
        </head>
        <body>
            <div id="todo-container">
                <h1>To-Do List</h1>
                <form action="/add" method="POST">
                    <input type="text" name="task" placeholder="Enter a task" required>
                    <button type="submit">Add Task</button>
                </form>
                <ul>${taskListHTML}</ul>
            </div>
            <script>
                function removeTask(index) {
                    fetch('/remove/' + index, { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if(data.success) location.reload();
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Route to handle adding tasks
app.post('/add', (req, res) => {
    tasks.push(req.body.task);  // Add the new task from the form
    res.redirect('/');  // Redirect back to the main page
});

// Route to handle removing tasks
app.post('/remove/:index', (req, res) => {
    tasks.splice(req.params.index, 1);  // Remove the task at the given index
    res.json({ success: true });  // Send back a success response
});

// Start the server
app.listen(port, () => {
    console.log(`To-Do List app listening at http://localhost:${port}`);
});
