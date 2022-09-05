import axios from '.';

export const notification = async body => {
  return axios.post('/notification', body).then(result => {
    return result;
  });
};

export const makeCreateDiscord = async body => {
  return axios.post('/notification/confirm', body).then(result => {
    return result;
  });
};
