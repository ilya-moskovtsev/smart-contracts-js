const assert = require('assert');
const ganache = require('ganache-cli'); // local Ethereum test network
const Web3 = require('web3');
const {interface, bytecode} = require('../compile');

const web3 = new Web3(ganache.provider());
let accounts;
let inbox;
const initialMessage = 'Hi there!';

beforeEach('Get a list of all accounts. Use one of those accounts to deploy the contract.', async () => {
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: [initialMessage]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Inbox', () => {
    it('should deploy a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('contract should have initial message', async function () {
        assert.equal(
            await inbox.methods.message().call(),
            initialMessage
        );
    });

    it('should set message', async function () {
        const newMessage = 'updated message';
        await inbox.methods.setMessage(newMessage).send({from: accounts[0]});
        assert.equal(
            await inbox.methods.message().call(),
            newMessage
        );
    });
});