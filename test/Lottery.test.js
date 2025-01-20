const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

const MIN_WEI = web3.utils.toWei('0.02', 'ether');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  })

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    })
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    })

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  })

  it('allows to enter multiple accounts', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    })

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    })

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    })

    assert.ok(players.includes(accounts[0]));
    assert.ok(players.includes(accounts[1]));
    assert.ok(players.includes(accounts[2]));
    assert.equal(3, players.length);
    
  })

  it('requires a minimum amount of ether to enter', async () => { 
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.002', 'ether')
      })
      assert(false);
    } catch (error) {
      assert(error);
      return;
    }
  })

});