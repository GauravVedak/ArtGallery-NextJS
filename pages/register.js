import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '@/lib/authenticate';

export default function Register() {
  const [form, setForm] = useState({ userName: '', password: '', passwordConfirm: '' });
  const [warning, setWarning] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      setWarning('Passwords do not match');
      return;
    }

    try {
      const result = await registerUser(form.userName, form.password, form.passwordConfirm);
      if (result) {
        router.push('/login');
      }
    } catch (err) {
      console.error("Register error:", err.message);
      setWarning(err.message || 'Registration failed. Username might already exist.');
    }
  }


  function updateFormField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <>
      <h2>Register</h2>
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

        <Form.Group className="mb-3" controlId="passwordConfirm">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={updateFormField}
          />
        </Form.Group>

        {warning && <Alert variant="danger">{warning}</Alert>}

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
}
// Final version - committed as Final Commit