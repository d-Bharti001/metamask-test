let web3;
let accounts;

async function initialize() {
    const provider = await detectEthereumProvider();
    if (provider && provider.isMetaMask) {
        if (provider.chainId == "0x5") {
            startApp(provider);
        }
        else {
            alert("Please switch to Goerli Test network\n and make sure you have an account in it.");
        }
    }
    else {
        alert("Please install Metamask extension and create an account on Goerli test network.\
        \nNo functionality can work without it.");
    }
}

async function startApp(provider) {

    web3 = new Web3(provider);

    accounts = await provider.request({method: 'eth_requestAccounts'});

    let info = document.getElementById("info");
    info.innerHTML = accounts[0];
}

window.addEventListener("DOMContentLoaded", initialize);
