'use strict';

module.exports = {
  get_days_by_month: get_days_by_month,
  num_to_month: num_to_month
};

const MonEnum = {
  "1": "JAN",
  "2": "FEB",
  "3": "MAR",
  "4": "APR",
  "5": "MAY",
  "6": "JUN",
  "7": "JUL",
  "8": "AUG",
  "9": "SEP",
  "10": "OCT",
  "11": "NOV",
  "12": "DEC"
};

function num_to_month(num){
  if (isNaN){
    return "INVALID";
  }
  return MonEnum[parseInt(num, 10)];
}

function leapYear(year)
{
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function get_days_by_month(mon, year){
  switch (mon){
    case "1": case "3": case "5": case "10": case "12": case MonEnum["1"]:
    case MonEnum["3"]:  case MonEnum["5"]: case MonEnum["10"]:  case MonEnum["12"]:
      return "31";
    case "4": case "6": case "8": case "9":  case "11":
    case MonEnum["4"]:  case MonEnum["6"]:  case MonEnum["8"]:
    case MonEnum["9"]: case MonEnum["11"]:
      return "30";
    case "2":
      return (leapYear(year)) ? "29" : "28";
    default:
      return null;
  }
}