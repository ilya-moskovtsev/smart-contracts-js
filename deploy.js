require('dotenv').config();

const Provider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const {interface, bytecode} = require('./compile');

const {MNEMONIC, PROVIDER_URL} = process.env;
const provider = new Provider(MNEMONIC, PROVIDER_URL);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    console.log('Deploying from account', address);
    const contract = await new web3.eth.Contract(JSON.parse(interface), address)
        .deploy({data: bytecode, arguments: ['Live']})
        .send({gas: '1000000', gasPrice: '5000000000', from: address});

    console.log('Contract deployed to', contract.options.address);
};
deploy();