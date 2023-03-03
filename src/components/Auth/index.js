import { Button, Card, Form, Input, Layout, message, Space, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { useMutation } from 'react-query';
import { login } from '../../apis';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [authForm] = Form.useForm();
  const { validateFields } = authForm;

  const { isLoading: isLogining, mutate: mutateLogin } = useMutation(login, {
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    },
    onError: (err) => {
      const errorMessage = JSON.stringify(err.message || err);
      message.error(errorMessage);
    },
  });

  const onLoginForm = async () => {
    const validatedFields = await validateFields();
    mutateLogin(validatedFields);
  };

  return (
    <Layout
      style={{
        height: '100vh',
        backgroundColor: 'white',
      }}
    >
      <Content
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          title="Login"
          headStyle={{
            backgroundColor: 'lightcoral',
            color: 'white',
          }}
          style={{ width: 400 }}
        >
          <Form
            form={authForm}
            layout="vertical"
            name="basic"
            // initialValues={}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input placeholder="Type your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password placeholder="Type your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                style={{ width: '100%' }}
                size="large"
                onClick={() => onLoginForm()}
                ghost
              >
                Login
              </Button>
            </Form.Item>
            <Space size="small">
              <span>Not a member?</span>
              <Button type="link" style={{ width: '100%' }} size="large">
                Signup Now
              </Button>
              <Spin spinning={isLogining} />
            </Space>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Auth;
