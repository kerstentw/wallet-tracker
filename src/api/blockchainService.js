const request = require("request-promise-native");

function DataHandler(){
  const endpoints = {
    bitcoin: {
      getSingleAccount:         (_acct) =>  { return `https://api.blockchain.info/q/addressbalance/${_acct}?confirmations=1&cors=true` },
      getMultipleAccounts:     (_accts) =>  { return `https://blockchain.info/balance?active=${_accts}&cors=true`}, // Pipe seperated
      //getMultipleAccounts:     ()       => {return `https://www.blockonomics.co/api/balance`},
      getRegularTransactions:   (_acct) =>  { return `https://blockexplorer.com/api/addr/${_acct}`},
      getTransactionByHash:  (_tx_hash) =>  { return `https://blockchain.info/rawtx/${_tx_hash}`},
      getInternalTransactions:  (_acct) =>  { return ""},
    },
    ethereum: {
      getSingleAccount:        (_acct) =>  { return `https://api.etherscan.io/api?module=account&action=balance&tag=latest&address=${_acct}`},
      getMultipleAccounts:    (_accts) =>  { return `https://api.etherscan.io/api?module=account&action=balancemulti&tag=latest&address=${_accts}`}, // comma-seperated <addr_array>.join(",")
      getRegularTransactions:  (_acct) =>  { return `https://api.etherscan.io/api?module=account&action=txlist&sort=desc&address=${_acct}&page=1&offset=10`},
      getInternalTransactions: (_acct) =>  { return `https://api.etherscan.io/api?module=account&action=txlistinternal&sort=desc&address=${_acct}&page=1&offset=10`}
    }
  }

  // BTC

  this.btcGetMultipleAccounts = async (_account_array) => {
    // to-do : cors

    let ep = endpoints.bitcoin.getMultipleAccounts(_account_array);
    let payload = {
      url: ep,
      method: "POST",
      form: {
        addr: _account_array.join(" ")
      }
    };
    resp = await request(payload);

    return JSON.parse(resp);
  }

  this.btcGetRegularTransactions = async (_account) => {
    let ep = endpoints.bitcoin.getRegularTransactions(_account);
    let payload = {
      url: ep,
      method: "GET",
    };
    resp = await request(payload);
    console.log("RESP",resp)

    return JSON.parse(resp);
  }

  this.btcGetInternalTransactions = async (_account) => {
    return null;
  }

  this.btcGetBalance = async (_account) => {
    let ep = endpoints.bitcoin.getSingleAccount(_account);
    let payload = {
      url: ep,
      method: "GET"
    }

    resp = await request(payload);

    return JSON.parse(resp);
  }

  // ETH

  this.ethGetMultipleAccounts = async (_account_array) => {
    let ep = endpoints.ethereum.getMultipleAccounts(_account_array);
    let payload = {
      url: ep,
      method: "GET"
    }

    resp = await request(payload);

    return JSON.parse(resp);
  }


  this.ethGetBalance = async (_account) => {
    let ep = endpoints.ethereum.getSingleAccount(_account);
    let payload = {
      url: ep,
      method: "GET"
    }

    resp = await request(payload);

    return JSON.parse(resp);
  }

  this.ethGetRegularTransations = async (_account) => {
    let ep = endpoints.ethereum.getRegularTransactions(_account);
    let payload = {
      url: ep,
      method: "GET",
    };
    resp = await request(payload);

    return JSON.parse(resp);
  }

  this.ethGetInternalTransactions = async (_account) => {
    let ep = endpoints.ethereum.getInternalTransactions(_account);
    let payload = {
      url: ep,
      method: "GET",
    };
    resp = await request(payload);

    return JSON.parse(resp);
  }

 // Macros

  this.ethSummaryDataOnAccount = async (_account) => {
    let ep = endpoints.ethereum.getSingleAccount(_account);
    let payload = {
      url: ep,
      method: "GET"
    }

    resp = await request(payload);

    return JSON.parse(resp);
  }

  this.ethGrabMacroDataOnAccount = async (_account) => {

  }


  return {
    ...this
  }
}

module.exports = {
  DataHandler: DataHandler
}
