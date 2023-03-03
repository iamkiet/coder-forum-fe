import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PostDetail from './components/Post/PostDetail';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Auth from './components/Auth';

const queryClient = new QueryClient({
  refetchOnWindowFocus: false,
  refetchOnmount: false,
  refetchOnReconnect: false,
  retry: 1,
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/auth/login" element={<Auth />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
