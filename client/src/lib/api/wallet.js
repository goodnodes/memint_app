import axios from '.';

export const createWallet = async body => {
  await axios.post('/auth/register', body);
};

export const KlayToLCN = async body => {
  return axios.post('/wallet/KlayToLCN', body).then(result => {
    return result;
  });
};

export const LCNToKlay = async body => {
  return axios.post('wallet/LCNToKlay', body).then(result => {
    return result;
  });
};

export const toOffChain = async body => {
  return axios.post('wallet/toOffChain', body).then(result => {
    return result;
  });
};
export const toOnChain = async body => {
  return axios.post('wallet/toOnChain', body).then(result => {
    return result;
  });
};

export const transferKlay = async body => {
  return axios.post('wallet/transferKlay', body).then(result => {
    return result;
  });
};

export const transferLCN = async body => {
  return axios.post('wallet/transferLCN', body).then(result => {
    return result;
  });
};

export const getBalance = async (id, addr) => {
  return axios.get(`wallet/getBalance/${id}/${addr}`).then(result => {
    return result.data;
  });
};
