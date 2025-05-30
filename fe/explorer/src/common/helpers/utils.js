import _ from "lodash";
import BigNumber from "bignumber.js";

import { WEI } from "common/constants";

export function truncateMiddle(str, maxLength = 20, separator = "...") {
  if (str && str.length <= 20) return str;

  let diff = maxLength - separator.length;
  let front = Math.ceil(diff / 2);
  let back = Math.floor(diff / 2);
  return str.substr(0, front) + separator + str.substr(str.length - back);
}

export function formatNumber(num, length = 0) {
  return num
    .toFixed(length)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function formatCurrency(num, length = 2) {
  return "$" + num.toFixed(length).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function formatCoin(weiAmount, length = 4) {
  return new BigNumber(weiAmount)
    .dividedBy(WEI)
    .decimalPlaces(length)
    .toFormat({
      decimalSeparator: ".",
      groupSeparator: ",",
      groupSize: 3,
    });
}

export function priceCoin(weiAmount, price) {
  return new BigNumber(weiAmount)
    .dividedBy(WEI)
    .multipliedBy(price)
    .decimalPlaces(2)
    .toFormat({
      decimalSeparator: ".",
      groupSeparator: ",",
      groupSize: 3,
    });
}

export function sumCoin(weiAmountA, weiAmountB) {
  return BigNumber.sum(new BigNumber(weiAmountA), new BigNumber(weiAmountB));
}

export function getQueryParam(search, name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  let results = regex.exec(search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
export const stakingCalc = {
  dailyCalc: (principal, rate, time) => {
    const dailyRate = rate / 36500;

    const amount = principal * Math.pow(1 + dailyRate, 1);
    const interest = amount - principal;
    return {
      amount: amount.toFixed(6),
      interest: interest.toFixed(6),
      stakingInterval: stakingIntervalCalc(principal, dailyRate, time, 365),
    };
  },
  weeklyCalc: (principal, rate, time) => {
    const weeklyRate = rate / 100 / 52;
    // Calculate the compound interest
    const amount = principal * Math.pow(1 + weeklyRate, time * 52);
    const interest = amount - principal;

    return {
      amount: amount.toFixed(6),
      interest: interest.toFixed(6),
      stakingInterval: stakingIntervalCalc(principal, weeklyRate, time, 52),
    };
  },
  monthlyCalc: (principal, rate, time) => {
    // Convert rate from annual percentage to monthly decimal rate
    const monthlyRate = rate / 100 / 12;
    // Calculate the compound interest
    const amount = principal * Math.pow(1 + monthlyRate, 1);
    const interest = amount - principal;

    return {
      amount: amount.toFixed(2),
      interest: interest.toFixed(2),
      stakingInterval: stakingIntervalCalc(principal, monthlyRate, time, 12),
    };
  },
  yearlyCalc: (principal, rate, time) => {
    // Convert rate from percentage to decimal

    const yearlyRate = rate / 100;
    // Calculate the compound interest
    const amount = principal * Math.pow(1 + yearlyRate, time * 0.0833334);
    const interest = amount - principal;

    return {
      amount: amount.toFixed(2),
      interest: interest.toFixed(2),
      stakingInterval: stakingIntervalCalc(principal, yearlyRate, time, 1),
    };
  },
};
export const stakingIntervalCalc = (principal, rate, time, powNumber) => {
  let p = Math.floor(principal);
  let roi = parseFloat(rate);
  let t = parseInt(time);
  let intervalArr = [];
  for (let i = 1; i <= Math.floor(t); i++) {
    const amountInterval = p * Math.pow(1 + roi, 1 * powNumber);
    const interestInterval = amountInterval - p;
    p += interestInterval;
    intervalArr.push({
      amount: amountInterval.toFixed(6),
      interest: interestInterval.toFixed(6),
    });
  }
  return intervalArr;
};
export function getSCPT(weiAmount) {
  return new BigNumber(weiAmount).dividedBy(WEI).toFixed();
}

export function getHex(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return "0x" + arr1.join("");
}

export function getArguments(str) {
  let res = str;
  const num = Math.floor(str.length / 64);
  res += `\n\n---------------Encoded View---------------\n${num} Constructor Argument${
    num > 1 ? "s" : ""
  } found :\n`;
  for (let i = 0; i < num; i++) {
    res += `Arg [${i}] : ` + str.substring(i * 64, (i + 1) * 64) + "\n";
  }
  return res;
}
