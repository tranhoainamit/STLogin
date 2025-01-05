import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterForm.css';

const { Title, Text } = Typography;

function RegisterForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const registerResponse = await axios.post('http://localhost:4000/api/auth/register', formData);
      message.success(registerResponse.data.message);

      // Tự động đăng nhập sau khi đăng ký thành công
      const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user)); // Lưu thông tin user
      message.success('Đăng nhập thành công');
      navigate('/home');
    } catch (error) {
      message.error(error.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="register-container">
      <div className="register-image">
        <img src="./images/background.jpg" alt="Background" />
      </div>
      <div className="register-form">
        <div className="logo">
          <img src="./images/logo.png" alt="Logo" />
        </div>
        <Title level={2} style={{ textAlign: 'center' }}>Sign Up</Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
          Create a new account
        </Text>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Username" required>
            <Input
              size="large"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input
              size="large"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Item>
          <Form.Item label="Password" required>
            <Input.Password
              size="large"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              SIGN UP
            </Button>
          </Form.Item>
        </Form>
        <div className="login-link">
          <Text type="secondary">Already have an account? </Text>
          <Link to="/login" style={{ fontWeight: 'bold' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
