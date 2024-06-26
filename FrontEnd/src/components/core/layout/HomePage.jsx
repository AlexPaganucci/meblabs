import React, { useState } from 'react';
import { Button } from 'antd';
import ExpenseList from './ExpenseList'; // Importa il componente della lista delle spese
// import ExpenseForm from './ExpenseForm'; // Importa il componente del form delle spese

const HomePage = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="home-page">
      <h1>Expense Tracker</h1>

      <ExpenseList />

      {/* <Button type="primary" onClick={toggleForm}>
        {showForm ? 'Hide Form' : 'Add Expense'}
      </Button>

      {showForm && <ExpenseForm />} */}
    </div>
  );
};

export default HomePage;
