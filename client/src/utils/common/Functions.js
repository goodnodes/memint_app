import {data} from '../../assets/docs/contents';

export const handleDate = obj => {
  // console.log(obj.toDate().toLocaleString());
  // console.log('debug');
  // console.log({obj});
  const date = obj.toDate().toLocaleString('en');
  // console.log(date);
  const res = date
    .slice(0, -17)
    .concat(' ' + date.slice(-11, -6))
    .concat(' ' + date.slice(-2));
  return res;
};

export const handleDateInFormat = obj => {
  const day = obj.toDate().getDay();
  const month = obj.toDate().getMonth() + 1;
  const date = obj.toDate().getDate();
  const dateString = obj.toDate().toLocaleString('ko-KR');
  let str = '';
  switch (day) {
    case 0:
      str = '일';
      break;
    case 1:
      str = '월';
      break;
    case 2:
      str = '화';
      break;
    case 3:
      str = '수';
      break;
    case 4:
      str = '목';
      break;
    case 5:
      str = '금';
      break;
    case 6:
      str = '토';
  }
  // if (date.length === 22) {
  //   return `${dateString.slice(5, 7)}월 ${dateString.slice(9, 10)}일(${str}) ${dateString.slice(
  //     12,
  //     -6,
  //   )}시`;
  // } else {
  //   return `${dateString.slice(5, 7)}월 ${dateString.slice(9, 11)}일(${str}) ${dateString.slice(
  //     13,
  //     -6,
  //   )}시`;
  // }
  if (month > 9) {
    if (date > 9) {
      return `${dateString.slice(6, 8)}월 ${dateString.slice(
        10,
        12,
      )}일(${str}) ${dateString.slice(14, -3)}`;
    } else {
      return `${dateString.slice(6, 8)}월 ${dateString.slice(
        10,
        11,
      )}일(${str}) ${dateString.slice(13, -3)}`;
    }
  } else {
    if (date > 9) {
      return `${dateString.slice(6, 7)}월 ${dateString.slice(
        9,
        11,
      )}일(${str}) ${dateString.slice(13, -3)}`;
    } else {
      return `${dateString.slice(6, 7)}월 ${dateString.slice(
        9,
        10,
      )}일(${str}) ${dateString.slice(12, -3)}`;
    }
  }
};

export const handleDateFromNow = obj => {
  const date = obj.toDate();
  const now = new Date();
  const time = now.getTime() - date.getTime();
  let str = '';
  if (time / (1000 * 60 * 60) < 1) {
    str = parseInt(time / (1000 * 60), 10) + 'minutes ago';
  } else if (time / (1000 * 60 * 60) > 24) {
    str = parseInt(time / (1000 * 60 * 60 * 24), 10) + 'days ago';
  } else {
    str = parseInt(time / (1000 * 60 * 60), 10) + 'hours ago';
  }
  return str;
};

export const handleISOtoLocale = dateInISO => {
  const date = new Date(dateInISO);
  const day = date.getDay();
  const localeDate = date.toLocaleString();
  let str = '';
  switch (day) {
    case 0:
      str = '일';
      break;
    case 1:
      str = '월';
      break;
    case 2:
      str = '화';
      break;
    case 3:
      str = '수';
      break;
    case 4:
      str = '목';
      break;
    case 5:
      str = '금';
      break;
    case 6:
      str = '토';
  }
  return `${localeDate.slice(5, 7)}월 ${localeDate.slice(
    9,
    11,
  )}일(${str}) ${localeDate.slice(13, -6)}시`;
};

export const handleBirth = str => {
  const year = str?.slice(0, 4);
  const now = new Date().getFullYear();
  const age = now - Number(year);

  let res = '';
  if (age > 40) {
    res = '40s';
  } else if (age >= 35) {
    res = 'Late 30s';
  } else if (age >= 30) {
    res = 'Early 30s';
  } else if (age >= 25) {
    res = 'Late 20s';
  } else if (age >= 20) {
    res = 'Early 20s';
  } else {
    res = '넘 어린디';
  }
  return res;
};
