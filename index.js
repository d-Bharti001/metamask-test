var web3;


async function initialize() {

    if (ethereum && ethereum.isMetaMask) {
        await ethereum.request({method: "eth_requestAccounts"});
        loadWeb3();
        loadInitials();
        loadResponses();

    /*    let chainId = await ethereum.request({method: "eth_chainId"});

        if (chainId == "0x5") {
            startApp(ethereum);
        }
        else {
            alert("Please switch to Goerli Test network\n and make sure you have an account in it.");
        }
    */
    }

    else {
        alert("Please install Metamask extension and create an account on Goerli test network.\
        \nNo functionality can work without it.");
    }
}

async function loadWeb3() {
    web3 = await new Web3(ethereum);
}

window.addEventListener("DOMContentLoaded", initialize);
