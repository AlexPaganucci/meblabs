// import React, { useState, useContext } from 'react';
// import { Form, Input, Button, message } from 'antd';
// import Api from '../../../helpers/core/Api';
// import AuthContext from '../../../helpers/core/AuthContext';

// const { TextArea } = Input;

// const ExpenseForm = ({ onAddExpense }) => {
//   const { logged } = useContext(AuthContext);
//   const [loading, setLoading] = useState(false);

//   const onFinish = async values => {
//     try {
//       setLoading(true);

//       const { title, description, amount } = values;

//       const newExpense = {
//         userId: logged._id,
//         title,
//         description,
//         amount,
//         date: new Date()
//       };

//       const response = await Api.post('/expenses', newExpense);

//       message.success('Spesa aggiunta con successo!');
//       onAddExpense(response.data); // Chiama la funzione per aggiornare la lista delle spese
//       setLoading(false);
//     } catch (error) {
//       console.error("Errore durante l'aggiunta della spesa:", error);
//       message.error("Si è verificato un errore durante l'aggiunta della spesa.");
//       setLoading(false);
//     }
//   };

//   const onFinishFailed = errorInfo => {
//     console.error('Validazione del form fallita:', errorInfo);
//     message.error('Compila correttamente tutti i campi del form.');
//   };

//   return (
//     <Form name="expenseForm" onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
//       <Form.Item label="Titolo" name="title" rules={[{ required: true, message: 'Inserisci il titolo della spesa' }]}>
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="Descrizione"
//         name="description"
//         rules={[{ required: true, message: 'Inserisci una breve descrizione' }]}
//       >
//         <TextArea rows={4} />
//       </Form.Item>

//       <Form.Item label="Importo" name="amount" rules={[{ required: true, message: "Inserisci l'importo della spesa" }]}>
//         <Input type="number" />
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           Aggiungi Spesa
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default ExpenseForm;
