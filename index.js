var web3;

async function load_web3() {
    web3 = await new Web3(provider);
    console.log("web3 loaded");
    var accounts = await provider.request({method: 'eth_requestAccounts'});

    let info = document.getElementById("info");
    info.innerHTML = accounts[0];
}

async function initialize() {

    const provider = await detectEthereumProvider();

    if (provider) {
        load_web3();
    }
    else {
        console.log("Metamask not detected");
    }
    
}

window.addEventListener("DOMContentLoaded", initialize);
