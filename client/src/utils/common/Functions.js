export const handleDate = obj => {
  // console.log(obj.toDate().toLocaleString());
  const date = obj.toDate().toLocaleString();
  // console.log(date);
  const res = date.slice(5, 11).concat(' ' + date.slice(13, -3));
  return res;
};

export const handleDateInFormat = obj => {
  const day = obj.toDate().getDay();
  const date = obj.toDate().toLocaleString('en-US');
  let str = '';
  switch (day) {
    case 0:
      str = 'Sun';
      break;
    case 1:
      str = 'Mon';
      break;
    case 2:
      str = 'Tue';
      break;
    case 3:
      str = 'Wed';
      break;
    case 4:
      str = 'Thur';
      break;
    case 5:
      str = 'Fri';
      break;
    case 6:
      str = 'Sat';
  }
  return date;
  // if (date.length === 22) {
  //   return `${date.slice(5, 7)}월 ${date.slice(9, 10)}일(${str}) ${date.slice(
  //     12,
  //     -6,
  //   )}시`;
  // } else {
  //   return `${date.slice(5, 7)}월 ${date.slice(9, 11)}일(${str}) ${date.slice(
  //     13,
  //     -6,
  //   )}시`;
  // }
};

export const handleDateFromNow = obj => {
  const date = obj.toDate();
  const now = new Date();
  const time = now.getTime() - date.getTime();
  let str = '';
  if (time / (1000 * 60 * 60) < 1) {
    str = parseInt(time / (1000 * 60), 10) + '분 전';
  } else if (time / (1000 * 60 * 60) > 24) {
    str = parseInt(time / (1000 * 60 * 60 * 24), 10) + '일 전';
  } else {
    str = parseInt(time / (1000 * 60 * 60), 10) + '시간 전';
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
      str = 'Sun';
      break;
    case 1:
      str = 'Mon';
      break;
    case 2:
      str = 'Tue';
      break;
    case 3:
      str = 'Wed';
      break;
    case 4:
      str = 'Thur';
      break;
    case 5:
      str = 'Fri';
      break;
    case 6:
      str = 'Sat';
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
  } else if (age > 35) {
    res = 'late 30s';
  } else if (age > 30) {
    res = 'early 30s';
  } else if (age > 25) {
    res = 'late 20s';
  } else if (age > 20) {
    res = 'early 20s';
  } else {
    res = 'too young';
  }
  return res;
};
