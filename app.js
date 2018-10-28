function checkCashRegister(price, cash, cid) {

  // Currency values in cents
  const currencyValues = [
    ["PENNY", 1],
    ["NICKEL", 5],
    ["DIME", 10],
    ["QUARTER", 25],
    ["ONE", 100],
    ["FIVE", 500],
    ["TEN", 1000],
    ["TWENTY", 2000],
    ["ONE HUNDRED", 10000]
  ]

  // convert dollars to cents
  price = dollarsToCents(price);
  cash = dollarsToCents(cash);
  cid = cid.map(([token, amount]) => [token, dollarsToCents(amount)])

  // calc change due to customer in cents
  const changeDue = cash - price;

  // if cash-in-drawer equals the change due
  if (getDrawerValue(cid) == changeDue) {
    cid = cid.map(([token, amount]) => [token, centsToDollars(amount)])
    return {
      status: "CLOSED",
      change: cid
    };
  }
  // if cash-in-drawer is less than the change due
  if (getDrawerValue(cid) < changeDue) {
    return {
      status: "INSUFFICIENT_FUNDS",
      change: []
    };
  }

  // if sufficient cash

  let change = getChange(changeDue, cid, currencyValues);

  if (change) {
    change = change.map(([token, amount]) => [token, centsToDollars(amount)])
    return {
      status: "OPEN",
      change
    };
  } else {
    return {
      status: "INSUFFICIENT_FUNDS",
      change: []
    };
  }
  
}


/* HELPER FUNCTIONS */

function getChange(changeDue, cid, currencyValues) {
  // get change array if sufficient currency, else return undefined

  const change = [];
  let changeStillDue = changeDue;
  // starting with highest currency value, check if enough to match change due
  for (let i = currencyValues.length - 1; i >= 0; i--) {

    let checkCid = cid[i][1];
    let currencyValue = currencyValues[i][1];

    while (
      checkCid >= currencyValue && changeStillDue >= 0 && currencyValue <= changeStillDue) {

      // check if change contains currencyValue
      let currencyCheck = false;

      for (let j = 0; j < change.length; j++) {
        if (change[j][0] == currencyValues[i][0]) {
          change[j][1] += currencyValue;
          currencyCheck = true;
        }
      }

      if (!currencyCheck) {
        change.push(currencyValues[i]);
      }

      changeStillDue = changeDue - getDrawerValue(change);
      checkCid -= currencyValue;
      
      if (changeStillDue == 0) {
        return change;
      }
    }
  }

  return undefined;
}


function dollarsToCents(dollarAmount) {
  return Math.round(dollarAmount * 100);
}

function centsToDollars(centAmount) {
  return (centAmount / 100);
}

function getDrawerValue(cid) {
  // Sum the value of currency in drawer
  let drawerValue = 0;

  for (let i = 0; i < cid.length; i++) {
    drawerValue += cid[i][1];
  }

  return drawerValue;
}

console.log(checkCashRegister(3.26, 100, [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
]));
