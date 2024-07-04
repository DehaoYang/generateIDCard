let coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
let checkDigitMap = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

function getValidNum(prefix) {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += prefix[i] * coefficient[i];
  }
  return checkDigitMap[sum % 11];
}

export function randomIdCard(code, birthday, gender, count) {
  let prefix = code + birthday;
  let map = [];
  let ids = [];
  for (let i = 0; i < count; i++) {
    let index = 0;
    b: while (true) {
      index = Math.floor(Math.random() * 99) + 1;
      for (let m in map) {
        if (m === index) {
          continue b;
        }
      }
      map.push(index);
      break;
    }
    if (index < 10) {
      index = "0" + index;
    }
    let idCard = prefix + index + gender;
    let validNum = getValidNum(idCard);
    idCard = idCard + validNum;
    ids.push(idCard);
  }
  return ids;
}

function checkIdCard(idCard) {
  if (idCard.trim().length !== 18) {
    return false;
  }
  let checkNum = getValidNum(idCard.substring(0, 17));
  let validNum = idCard.substring(17, 18);
  if (validNum !== checkNum) {
    return false;
  }
  return true;
}

function parseIdCard(idCard) {
  if (idCard.length !== 18) return;
  let code = idCard.substring(0, 6);
  let year = idCard.substring(6, 10);
  let month = idCard.substring(10, 12);
  let day = idCard.substring(12, 14);
  let index = idCard.substring(14, 16);
  let gender = idCard.substring(16, 17);
  let validNum = idCard.substring(17, 18);
  return {
    code: code,
    year: year,
    month: month,
    day: day,
    index: index,
    gender: gender,
    validNum: validNum,
  };
}
