import { Layout, List, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login');
    }
  }, [navigate]);

  const data = ['63fe1c36ee592107cabffce0'];

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
          marginTop: 20,
        }}
      >
        <List
          size="large"
          header={<Typography.Title>Post List</Typography.Title>}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/post/${item}`}>#post - {item}</Link>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default Home;
