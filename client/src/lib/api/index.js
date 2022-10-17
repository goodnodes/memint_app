import axiosInstance from 'axios';

const axios = axiosInstance.create({
  // baseURL: 'http://localhost:5000',
  // baseURL: 'https://memint-server.herokuapp.com/',
  baseURL: 'https://memint-app-server.herokuapp.com/',
  // baseURL: 'http://ec2-3-34-140-41.ap-northeast-2.compute.amazonaws.com:5000/',
});

export default axios;
