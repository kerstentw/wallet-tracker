var state = {
  isRequestingData: false
};

function ethHandler() {

  let init = () => {

  }

  return {
    init: init
  }
}



function btcHandler() {

    let init = () => {

    }

    return {
      init: init
    }
}



/********************************
******** DOM Generator **********
*********************************/

function DOMGenerators() {

  let __formatDate = (_dateObj) => {

    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    let month_formatted = month[_dateObj.getUTCMonth()];
    let day = _dateObj.getUTCDate();
    let year = _dateObj.getUTCFullYear();

    return `${day} ${month_formatted} ${year}`;


  }

  let createAccountList = (accounts) => {
    var keys = Object.keys(accounts);

    return keys.map(data => {
      let acct = accounts[data];
      return `
        <div id="wallet-selector" class="wallet-wrap" val="${acct.address}">
          <div class="row">
            <h3 class="address_head">
              <img class="coin_logo" src=${acct.protocol == "ethereum" ?
                "https://cdn.prftech.com/coin_imgs/ethereum.png" :
                 "https://cdn.prftech.com/coin_imgs/bitcoin.png" }
               />
               <div id="${acct.address}_changed" class="red_circle" style="display:none"></div>

                <div class="address-wrap">
                  ${acct.address}
                </div>
            </h3>
            </div>

            <span class="date-span">
              <strong> Added On: </strong>
              ${__formatDate(new Date(acct.added))}
            </span> <br/>
           <span class="date-span">
              <strong> Last Modified: </strong>
              ${__formatDate(new Date(acct.modified))}
           </span>
           <input id="tree_elem_no_style" class="${acct.address}-${acct.protocol}" val="${acct.address}" style="display:none"/>
        </div>
      `
    }).join("");
  }

  return {
    createAccountList: createAccountList
  }
}


/********************************
******** Data Updater ************
*********************************/

// test_run = async () => {btcGetMultipleAccounts(["bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej", "1JC7D26cpbCwCFQButmwcJKpAGXYiKPCi5"])}



/********************************
******** Data Controller ************
*********************************/
function DataDOMController(_DataHandler) {

  return {
    ...this
  }

}

/********************************
******** DOM Updater ************
*********************************/

function DOMUpdater(_wallet_handler) {

  let renders = {
    wallet_table_data: "wallet-table-data"
  }

  var DomGens = new DOMGenerators();

  let updateWalletList = () => {
    let accounts = _wallet_handler.getWallets();
    let account_dom_elem = DomGens.createAccountList(accounts);
    $(`#wallet-table-data`).html(account_dom_elem);
  }

  return {
    ...this,
    updateWalletList: updateWalletList
  }
}


/********************************
****** Wallet Data Handler *******
*********************************/

function walletHandler(_address) {

  let classifyAddress = (_addr) => {
    const addrRxs = [
      ["ethereum", /^0x[a-fA-F0-9]{40}$/g],
      ["bitcoin", /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/g]
    ]

    let stat = false;

    for (rx of addrRxs) {
      if (rx[1].exec(_addr)) {
        return rx[0];
      } else {
        stat = false;
      }
    }

    return stat;
  }

  let getChainHandler = (_protocol) => {
    const chainHandlers = {}

    return chainHandlers[_protocol].init()
  }

  this.getMetaInfo = ()=> {

  }

  this.getFullInfo = () => {

  }

  this.address = _address;
  this.address_type = classifyAddress(_address);

  return {
    ...this,
    classifyAddress: classifyAddress
  }
}



/********************************
****** Wallet DOM Controller *******
*********************************/

function walletViewController(_target, _trigger, _stateHandler){
  let target_elem = $(`#${_target}`);
  this.trigger = $(`#${_trigger}`);
  this.lightbox = null;

  let open = () => {
    this.lightbox = lity(target_elem);
    return this.lightbox;
  }

  let close = () => {
    this.lightbox.close();
    return;
  }

  let addWalletFromDOM = () => {
    let address = $("#wallet-input").val();

    let walHandler = new walletHandler(address);

    if (!walHandler.address_type) {
      $("#addWallMsg").text("Not a Valid Address.");
      return false;
    }


    _stateHandler.addWallet({addr: address, protocol: walHandler.address_type});

    return true;
  }

  let mountInternalListeners = () => {
    $("#submit-wallet-button").on('click', addWalletFromDOM);
  }

  let listener = () => {
    open();
    mountInternalListeners();
  }

  return {
    ...this,
    listener: listener
  };
}

/*************************************
****** Sidebar View Controller *******
**************************************/

const BITCOIN_LOGO = "https://cdn.prftech.com/coin_imgs/bitcoin.png"
const ETHEREUM_LOGO = "https://cdn.prftech.com/coin_imgs/ethereum.png"

function SidebarViewController(_wallet_controller) {
  this.wallet_table = "wallet-table";

  let renderSingleWalletListing = (_wallet_data) => {

  }

  let updateEthAmounts = () => {
    _wallet_controller.getWallets();
  }

  let renderWalletList = () => {
    $(`#${this.wallet_table}`).DataTable();
  }

  let refreshWalletList = () => {
    renderWalletList();
  }
}


const walletDataUpdater =  {

  fetchWalletMainPageData: async (_addr, _protocol) => {
    let ep = _protocol? `/summary/eth?address=${_addr}` : `/summary/btc?address=${_addr}`
    let data = await $.ajax({
      method: "GET",
      url: ep
    });

    console.log(data)

    return data.data;
  }
}


function infoViewProcessor() {

  this.EthTransactionObjToHTML = (_tx_obj) => {
    return `



    <div class="card trans_card">

      <div class="v_timestamp">
        ${new Date(parseInt(_tx_obj.timeStamp) * 1000)}
      </div>

      <div class="v_status">
        ${parseInt(_tx_obj.isError) < 1? "<strong style='color: green'> Success </strong>" : "<strong style='color: red'> Failure </strong>"}
      </div>


      <h6> Transaction Hash </h6>
      <div class="v_trans_hash">
        ${_tx_obj.hash}
      </div>

      <h6> From </h6>
      <div class="v_from">
        ${_tx_obj.from}
      </div>

      <h6> To </h6>
      <div class="v_to">
        ${_tx_obj.to? _tx_obj.to : "Contract Creation"}
      </div>

      <h6> Block Hash </h6>
      <div class="v_block_hash">
        ${_tx_obj.blockHash}
      </div>

      <h6> Block Number </h6>
      <div class="v_block_num">
        ${_tx_obj.blockNumber}
      </div>


      <br/>

      <div class="row">
        <div class="col-md-3">
          <h6> Nonce </h6>
          <div class="v_nonce">
            ${_tx_obj.nonce}
          </div>
        </div>
        <div class="col-md-3">
          <div class="v_cumulative_gas_used">
            <h6>Total Gas</h6>
            ${_tx_obj.cumulativeGasUsed? _tx_obj.cumulativeGasUsed : "N/A"}
          </div>
        </div>
        <div class="col-md-3">
          <h6>Gas Used</h6>
          <div class="v_gas_used">
            ${_tx_obj.gasUsed}
          </div>
        </div>

        <div class="col-md-3">
          <h6>Total Confs </h6>
          <div class="v_confirmations">
            ${_tx_obj.confirmations? _tx_obj.cumulativeGasUsed : "N/A"}
          </div>
        </div>
      </div>
    </div>
    `
  }

  this.processEthTransactionArrayToHTML = (_tx_array) => {
    let html_array = _tx_array.map(data=>this.EthTransactionObjToHTML(data));
    return html_array.join("");
  }

  return {
    ...this
  }

}

/*********************
*  Global Functions *
**********************/

function addListeners(_handlers) {

  let ivProcess = new infoViewProcessor()

  for (handler of _handlers) {
    $(handler.trigger).on('click', handler.listener);
  }

  let click_elems = document.getElementsByClassName("wallet-wrap");

  for (let i = 0; i < click_elems.length; i++) {
    click_elems[i].addEventListener("click", async (evt)=>{
      let test_glob = click_elems[i];
      let target = click_elems[i].getElementsByTagName("input")[0].className.split("-"); // This is hacky as shit

      let address = target[0];
      let protocol = target[1];

      let data = await walletDataUpdater.fetchWalletMainPageData(address, protocol);

      $("#address_val").html(address);
      $("#balance_val").html(data.balance);
      $("#itransactions_val").html(ivProcess.processEthTransactionArrayToHTML(data.itxs));
      $("#transactions_val").html(ivProcess.processEthTransactionArrayToHTML(data.txs));
    });
  }
}



/***************************
****** Constants *******
****************************/

const initialState = {
  wallets: {},
}

const LABEL = "walletmon";

/***************************
****** Main Function *******
****************************/

$(document).ready(()=>{
  let walletStateHandler = new walletMonLocalStateHandler(initialState, LABEL);
  walletStateHandler.init();

  let addWalletDOMHandler = walletViewController("add-wallet", "add-wallet-button", walletStateHandler);

  let domHandler = new DOMUpdater(walletStateHandler);

  let handlers = [addWalletDOMHandler];

  domHandler.updateWalletList();

  addListeners(handlers);

});
