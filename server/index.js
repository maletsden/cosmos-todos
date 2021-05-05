const express = require('express');
const bodyParser = require('body-parser');
const DBController = require('../db/DBController.js');

const app = express();
const port = process.env.PORT || 3000;
const dbController = new DBController(process.env.COSMOS_DATABASE_ID, process.env.COSMOS_CONTAINER_ID);

app.use(bodyParser.json());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile('./dist/index.html');
});

app.get('/get-todos', async (req, res) => {
  try {
    const todos = await dbController.query('SELECT t.id, t.description, t.completed  FROM t');

    res.json({ todos });
  } catch (err) {
    res.status(500).send(`Failed getting todos, error - ${err.message}`);
  }
});

app.post('/add-todo', async (req, res) => {
  try {
    const { description } = req.body;

    const { id } = await dbController.add({
      description,
      completed: false,
    });

    res.json({ id });
  } catch (err) {
    res.status(500).send(`Failed to add todo, error - ${err.message}`);
  }
});

app.post('/delete-todo', async (req, res) => {
  let id;
  try {
    id = req.query.id;

    await dbController.delete(id);
    res.json({ id });
  } catch (err) {
    res.status(500).send(`Failed to delete todo with id = ${id}, error - ${err.message}`);
  }
});

app.post('/edit-todo', async (req, res) => {
  let id;
  try {
    const todo = req.body;
    id = todo.id;

    await dbController.update(todo);

    res.json({ id });
  } catch (err) {
    res.status(500).send(`Failed to edit todo with id = ${id}, error - ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
