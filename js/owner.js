const ethereum = window.ethereum;
const CONTRACT_ADDR = "0xAE632FFfAd3B185fe95f828D4179F64Bb46768FE";
var web3;
var contract;
var userAddress = "";
var savedWalletBalance = "0";
var savedAllowance = "0";

async function initialize() {
    if (ethereum && ethereum.isMetaMask) {
        let chainId = await ethereum.request({method: "eth_chainId"});
        if (chainId == "0x5") {
            initializeContents();
        }
        else {
            alert("Please switch to Goerli Test network.");
        }
    }

    else {
        alert("Metamask extension missing!\
        \nPlease install Metamask and switch to Goerli test network.");
    }
}

async function initializeContents() {
    await updateUserAddress();
    await updateWeb3();
    await updateContract();
    updateWalletBalance();

    ethereum.on("accountsChanged", async function(accounts) {
        await updateUserAddress();
    });

    ethereum.on("chainChanged", function(chainId) {
        window.location.reload();
    });
}

async function updateUserAddress() {
    let addresses = await ethereum.request({method: "eth_requestAccounts"});
    userAddress = addresses[0];
}

async function updateWeb3() {
    web3 = new Web3(ethereum);
}

async function updateContract() {
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDR);
}

async function updateWalletBalance() {
    savedWalletBalance = await web3.eth.getBalance(CONTRACT_ADDR);
    updateWalletBalanceContent();
}

function updateWalletBalanceContent() {
    let unit = document.getElementById("wallet-balance-units").value;
    let value = web3.utils.fromWei(savedWalletBalance, unit);
    document.getElementById("wallet-balance").innerText = value;
}

async function updateCurrentAllowance() {
    let accAddress = document.getElementById("new-account").value;
    savedAllowance = await contract.methods.allowance(accAddress).call();
    updateCurrentAllowanceContent();
}

function updateCurrentAllowanceContent() {
    let unit = document.getElementById("current-allowance-units").value;
    let value = web3.utils.fromWei(savedAllowance, unit);
    document.getElementById("current-allowance").innerText = value;
}

async function allowanceTransaction() {
    let newAccount = document.getElementById("new-account").value;
    let allowance = document.getElementById("new-allowance").value;
    let unit = document.getElementById("new-allowance-units").value;

    if(/\./.test(allowance)) {
        alert("Please enter only integral values. Decimal values aren't supported.");
        return;
    }

    allowance = web3.utils.toWei(allowance, unit);
    await contract.methods.setAllowance(newAccount, allowance).send({from: userAddress});

    updateCurrentAllowance();
    document.getElementById("new-allowance").value = "0";
}

async function depositTransaction() {
    let amount = document.getElementById("deposit-amount").value;
    let unit = document.getElementById("deposit-amount-units").value;

    if(/\./.test(amount)) {
        alert("Please enter only integral values. Decimal values aren't supported.");
        return;
    }

    amount = web3.utils.toWei(amount, unit);
    await web3.eth.sendTransaction({from: userAddress, to: CONTRACT_ADDR, value: amount});

    updateWalletBalance();
    document.getElementById("deposit-amount").value = "0";
}

async function withdrawTransaction() {
    let toAccount = document.getElementById("target-account").value;
    let amount = document.getElementById("withdraw-amount").value;
    let unit = document.getElementById("withdraw-amount-units").value;

    if(/\./.test(amount)) {
        alert("Please enter only integral values. Decimal values aren't supported.");
        return;
    }

    amount = web3.utils.toWei(amount, unit);
    await contract.methods.withdrawMoney(toAccount, amount).send({from: userAddress});

    updateWalletBalance();
    document.getElementById("withdraw-amount").value = "0";
}

window.addEventListener("DOMContentLoaded", initialize);
