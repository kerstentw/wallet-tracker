const handlers = require("./blockchainService");
const DataHandler = new handlers.DataHandler();


function Controllers (_app) {



  function index() {
    _app.get("/", (req, res) => {
      res.send({data: true, msg: "up"})
    })
  }

  function staticDir() {

  }

  function getDataPage() {

  }

  async function BTCGetListOfBalances() {
    _app.get("/balances/btc", async (req,res) => {

      let addresses = req.query.addresses;

      if (!addresses) {
        res.send({data: {}, status: 400, msg: "error, please include addresses"})
        return;
      }

      let bals = await DataHandler.btcGetMultipleAccounts(addresses.split(","));

      res.send({data: bals, msg: "ok"});
    });
  }

  function BTCGetSingleBalance() {
    _app.get("/balanceof/btc", async (req,res) => {
      let address = req.query.address;
      if (!address) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }

      let resp = await DataHandler.btcGetBalance(address);

      res.send({data: resp.data, msg: "ok"});
    });
  }

  function BTCGetTransactionList () {
    _app.get("/transactions/btc", async (req,res) => {
      let address = req.query.address;
      if (!address) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }

      let resp = await DataHandler.btcGetRegularTransactions(address);

      res.send({data: resp.transactions, msg: "ok"});
    });
  }


  function BTCGetAccountSummary() {
    _app.get("/summary/btc", async (req,res) => {
      let address = req.query.address;
      if (!address) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }
      let resp = await DataHandler.btcGetRegularTransactions(address);

      resp.transactions = resp.transactions.splice(0,9);

      res.send({data: resp, msg: "ok"});
    });
  }


  function ETHGetMultipleAccounts() {
    _app.get("/balances/eth", async (req,res) => {
      let addresses = req.query.addresses;
      if (!addresses) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }
      let resp = await DataHandler.ethGetMultipleAccounts(addresses);

      res.send({data: resp, msg: "ok"});
    });
  }

  function ETHGetSingleBalance() {
    _app.get("/balanceof/eth", async (req,res) => {
      let address = req.query.address;
      if (!address) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }

      let resp = await DataHandler.ethGetBalance(address);

      res.send({data: resp.result, msg: "ok"});
    });
  }


  function ETHGetRegularTransations() {
    _app.get("/transactions/eth/regular", async (req,res) => {
      let address = req.query.address;
      if (!address) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }

      let resp = await DataHandler.ethGetRegularTransations(address);

      res.send({data: resp.result, msg: "ok"});
    });
  }


  function ETHGetInternalTransactions() {
    _app.get("/balanceof/eth/internal", async (req,res) => {
      let address = req.query.address;
      if (!address) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }

      let resp = await DataHandler.ethGetInternalTransactions(address);

      res.send({data: resp.result, msg: "ok"});
    });
  }


  function ETHGetAccountSummary() {
    _app.get("/summary/eth", async (req, res) => {
      let address = req.query.address;

      if (!address) {
        res.send({data: {}, status: 400, msg: "error, please include address"})
        return;
      }

      let balance = await DataHandler.ethGetBalance(address);
      let transactions = await DataHandler.ethGetRegularTransations(address);
      let itransactions = await DataHandler.ethGetInternalTransactions(address);
      console.log(itransactions)

      res.send({data: {balance: balance.result, txs: transactions.result, itxs: itransactions.result}, msg: "ok"});

    })
  }

  function bindEps() {
    index();
    staticDir();
    getDataPage();
    BTCGetListOfBalances();
    BTCGetSingleBalance();
    BTCGetTransactionList();
    BTCGetAccountSummary();
    ETHGetMultipleAccounts();
    ETHGetSingleBalance();
    ETHGetRegularTransations();
    ETHGetInternalTransactions();
    ETHGetAccountSummary();
  }

  return {
    bindEps: bindEps
  }
}


module.exports.bindControllers = (_app) => {
  let controllers = new Controllers(_app);
  controllers.bindEps();
}
