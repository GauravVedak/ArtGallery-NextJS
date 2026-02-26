import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';
import { authenticateUser } from '@/lib/authenticate';

export default function Login() {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [warning, setWarning] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await authenticateUser(form.userName, form.password);
      if (result) {
        router.push('/favourites');
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setWarning(err.message || 'Invalid username or password');
    }
  }


  function updateFormField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="userName">
          <Form.Label>User:</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            value={form.userName}
            onChange={updateFormField}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={updateFormField}
          />
        </Form.Group>

        {warning && <Alert variant="danger">{warning}</Alert>}

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}
// Final version - committed as Final Commit