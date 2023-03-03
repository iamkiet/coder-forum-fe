import axios from 'axios';

const url = 'https://coder-forum-api.onrender.com/api/v1/';

export const API = axios.create({
  baseURL: url,
  timeout: 1000,
});

API.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers['x-access-token'] = token;

  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject({
      error: error?.response?.data,
      status: error?.response?.status,
    });
  }
);

export const getPostComments = async (query, pageParam = 0) => {
  try {
    const { postId } = query;
    const path = `comment/post-comments/${postId}?page=${pageParam}`;
    const res = await API.get(path);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCommentReplies = async (query, pageParam = 0) => {
  try {
    const { commentId } = query;
    const path = `comment/${commentId}/replies?page=${pageParam}`;
    const res = await API.get(path);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createComment = async (data) => {
  try {
    const res = await API.post('comment/create', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data) => {
  try {
    const res = await API.post('user/login', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
