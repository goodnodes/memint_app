import * as RNFS from 'react-native-fs';

export const checkExist = async path => {
  return RNFS.exists(path).then(result => {
    return result;
  });
};

export const downloadFile = async (uri, path, setUserImg) => {
  return RNFS.downloadFile({
    fromUrl: uri,
    toFile: path,
  }).promise.then(() => setUserImg(path));
  //   .then(() => {
  //     return;
  //   });
};
