const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log('TROLOLO')

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  })

});