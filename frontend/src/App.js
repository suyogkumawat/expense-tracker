import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get('http://localhost:4000/api/expenses');
    setExpenses(res.data);
    generateChart(res.data);
  };

  const handleAdd = async () => {
    await axios.post('http://localhost:4000/api/expenses', {
      title, amount, category
    });
    setTitle(''); setAmount(''); setCategory('');
    fetchExpenses();
  };

  const generateChart = (data) => {
    const grouped = data.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(grouped),
      datasets: [{
        label: 'Spending by Category',
        data: Object.values(grouped),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    });
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h2>Expense Tracker</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <button onClick={handleAdd}>Add Expense</button>

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>{e.title} - ${e.amount} - {e.category}</li>
        ))}
      </ul>

      <div style={{ width: '500px', marginTop: '40px' }}>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default App;
