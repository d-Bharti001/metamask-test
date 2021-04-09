
var web3;

async function initialize() {

    const provider = await detectEthereumProvider();

    if (provider) {
        web3 = new Web3(provider);
        console.log("web3 loaded");
        //var accounts = await provider.request({method: 'eth_requestAccounts'});
    }
    else {
        console.log("Metamask not detected");
    }
    
}


window.addEventListener("DOMContentLoaded", initialize);
