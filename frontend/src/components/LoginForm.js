import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const { Title, Text } = Typography;

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', formData);
      message.success(response.data.message);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin user
      navigate('/home');
    } catch (error) {
      message.error(error.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <img src="./images/logo.png" alt="Logo" />
        </div>
        <Title level={2} style={{ textAlign: 'center' }}>Welcome Back</Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
          Log in to your account to continue
        </Text>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email address" required>
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
              LOGIN
            </Button>
          </Form.Item>
        </Form>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="register-link">
          <Text type="secondary">Don’t have an account? </Text>
          <Link to="/register" style={{ fontWeight: 'bold' }}>Register here</Link>
        </div>
      </div>
      <div className="login-image">
        <img src="./images/background.jpg" alt="Background" />
      </div>
    </div>
  );
}

export default LoginForm;
