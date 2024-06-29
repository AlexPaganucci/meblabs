import React, { useContext, useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Card } from 'antd';
import Api from '../../../helpers/core/Api';
import AuthContext from '../../../helpers/core/AuthContext';

const ExpenseList = () => {
  const { logged } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const userId = logged._id;
      const response = await Api.get(`/expenses/${userId}`);
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async values => {
    try {
      const newExpense = {
        ...values,
        userId: logged._id,
        date: new Date()
      };
      const response = await Api.post('/expenses', newExpense);
      setExpenses(prevExpenses => [...prevExpenses, response.data]);
      message.success('Spesa aggiunta con successo!');
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      message.error("Si è verificato un errore durante l'aggiunta della spesa.");
    }
  };

  const handleDeleteExpense = async id => {
    try {
      await Api.delete(`/expenses/${id}`);
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense._id !== id));
      message.success('Spesa cancellata con successo!');
    } catch (error) {
      message.error('Si è verificato un errore durante la cancellazione della spesa.');
    }
  };

  const showModal = expense => {
    setCurrentExpense(expense);
    form.setFieldsValue(expense);
    setIsModalVisible(true);
  };

  const handleUpdateExpense = async values => {
    try {
      const updatedExpense = {
        ...currentExpense,
        ...values,
        date: new Date()
      };
      await Api.put(`/expenses/${currentExpense._id}`, updatedExpense);
      setExpenses(prevExpenses =>
        prevExpenses.map(expense => (expense._id === currentExpense._id ? updatedExpense : expense))
      );
      message.success('Spesa aggiornata con successo!');
      setIsModalVisible(false);
      setCurrentExpense(null);
    } catch (error) {
      message.error("Si è verificato un errore durante l'aggiornamento della spesa.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentExpense(null);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const formatDate = date => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: '16px' }}>
        Aggiungi Spesa
      </Button>
      {loading ? (
        <Card loading />
      ) : (
        expenses.map(item => (
          <Card key={item._id} title={item.title} style={{ marginBottom: 16 }}>
            <p>{item.description}</p>
            <p>Importo: € {item.amount}</p>
            <p>Data: {formatDate(item.date)}</p>
            <Button type="link" onClick={() => handleDeleteExpense(item._id)}>
              Cancella
            </Button>
            <Button type="link" onClick={() => showModal(item)}>
              Modifica
            </Button>
          </Card>
        ))
      )}

      <Modal title="Modifica Spesa" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form
          form={form}
          name="updateExpenseForm"
          initialValues={currentExpense}
          onFinish={handleUpdateExpense}
          layout="vertical"
        >
          <Form.Item
            label="Titolo"
            name="title"
            rules={[{ required: true, message: 'Inserisci il titolo della spesa' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Descrizione"
            name="description"
            rules={[{ required: true, message: 'Inserisci una breve descrizione' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Importo"
            name="amount"
            rules={[{ required: true, message: "Inserisci l'importo della spesa" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Aggiorna Spesa
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Aggiungi Spesa" visible={isAddModalVisible} onCancel={handleAddCancel} footer={null}>
        <Form form={addForm} name="addExpenseForm" onFinish={handleAddExpense} layout="vertical">
          <Form.Item
            label="Titolo"
            name="title"
            rules={[{ required: true, message: 'Inserisci il titolo della spesa' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Descrizione"
            name="description"
            rules={[{ required: true, message: 'Inserisci una breve descrizione' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Importo"
            name="amount"
            rules={[{ required: true, message: "Inserisci l'importo della spesa" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Aggiungi Spesa
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseList;
