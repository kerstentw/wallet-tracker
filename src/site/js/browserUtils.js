
function walletMonitor() {
  this.getMultipleETHBalances = async (_address_array) => {
    let addresses = _address_array.join(",");

    let ep = `/balances/eth?addresses=${addresses}`;
    let payload = {
      url: ep,
      method: "GET"
    }

    let balances = await $.ajax(payload);

    return balances;

  };

  this.getSingleBalance = async (_addr, _protocol) => {

    let ep = _protocol == 'ethereum'? `/balanceof/eth?address=${_addr}` : `/balanceof/btc?address=${_addr}`;
    let payload = {
      url: ep,
      method: "GET"
    }

    let balance = await $.ajax(payload);

    return balance;
  }

  this.getMultipleBTCBalances = async (_address_array) => {

  }



}




/*
* This wraps the window.localState specifically For this app.
*/

function walletMonLocalStateHandler(_initState, _label, _requester) {

  this.label = _label
  let walletMon = new walletMonitor()

  let isWalletUploaded = (_prop_addr, _cur_wallet_state) => {
    return Boolean(_cur_wallet_state[_prop_addr]);
  }

  this.addWallet = async (_wallet_obj) => {
    let wallets = getCurrentState().wallets;

    let exists = isWalletUploaded(_wallet_obj.addr, wallets);

    const new_address = {
      address: _wallet_obj.addr,
      protocol: _wallet_obj.protocol,
      added: exists? wallets[_wallet_obj.addr].added: new Date().getTime(),
      modified: new Date().getTime(),
      cur_balance: await walletMon.getSingleBalance(_wallet_obj.addr, _wallet_obj.protocol),
      has_changed: false,
      label: ""
    };

    wallets[_wallet_obj.addr] = new_address;
    setInternalLabelState("wallets", wallets);
  }


  this.getWallets = () => {
    return getCurrentState().wallets;
  }

  this.resetState = (_state_obj) => {
    window.localStorage.setItem(this.label, processInOut(_state_obj));
  }

  // ORM-like Helpers

  let processInOut = (_object) => {
    let processors = {
      "string" : JSON.parse,
      "object" : JSON.stringify
    }

    return processors[typeof(_object)](_object);
  }

  let setInternalLabelState = (_key, _value) => {
    let current_state = getCurrentState();
    current_state[_key] = _value;
    setState(current_state);
  }


  let setState = (_newState) => {
    return window.localStorage.setItem(this.label, processInOut(_newState));
  }

  let getCurrentState = () => {
    return processInOut(window.localStorage.getItem(this.label));
  }

  /*
  *  This sets initial application state.  Must be called upon app load.
  */
  let getSetInitialState = ()=>{
    let initial_state = getCurrentState();


    if (!initial_state || !initial_state.wallets) {

      window.localStorage.setItem("walletmon", processInOut(_initState));
      return _initState;
    } else {
      return initial_state;
    }
  }

  this.init = () => {
    return getSetInitialState();
  }

  return {
    ...this
  }
}
