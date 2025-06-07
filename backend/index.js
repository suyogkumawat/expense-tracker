const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let expenses = [];

app.get('/api/expenses', (req, res) => res.json(expenses));

app.post('/api/expenses', (req, res) => {
  const { title, amount, category } = req.body;
  const newExpense = { id: uuidv4(), title, amount, category, date: new Date() };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
