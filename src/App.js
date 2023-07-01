import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import BigInt from 'big-integer'; 
import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [click, setClick] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [clickedNum, setClickedNum] = useState(0);
  const [blockDetails, setBlockDetails] = useState(null);
  const [gas, setGas] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [chose, setChose] = useState(false);
  const [txOutput, setTxOutput] = useState()
  const num = [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13]
const numbers = num.map(num => 
<ul key = {blockNumber + num}>
<button className="App" onClick={handleClick}>
        Block Number: {blockNumber + num}
        </button>
</ul>);
let latestTx = []
for (let i = 0; i<15; i++ ) {
  transactions && latestTx.push(transactions[i])
}
const txo =  latestTx.length === 15 && latestTx.map((transaction, index) => (
  <ul key = {index}>
    <button className='App' onClick={handleTxo}>
    {transaction?.transactionHash}
    </button>
  </ul>
));

function handleTxo(event) {
  const buttonText = event.target.textContent.toString();
  async function getTxo() {
    const txoo = await alchemy.core.getTransactionReceipt(buttonText);
    const txRender = txoo && function() {
      return(
        <ul>
          <h2>Transaction Details</h2>
  <li>To: {txoo.to}</li>
  <li>From: {txoo.from}</li>
  <li>Contract Address: {txoo.contractAddress}</li>
  <li>Transaction Index: {txoo.transactionIndex}</li>
  <li>Gas Used: {BigInt(txoo.gasUsed._hex).toString()}</li>
  <li>Block Hash: {txoo.blockHash}</li>
  <li>Transaction Hash: {txoo.transactionHash}</li>
  <li>Block Number: {txoo.blockNumber}</li>
  <li>Confirmations: {txoo.confirmations}</li>
  <li>Cumulative Gas Used: {BigInt(txoo.cumulativeGasUsed._hex).toString()}</li>
  <li>Effective Gas Price: {Utils.formatEther(BigInt(txoo.effectiveGasPrice._hex).toString())} ETH</li>
  <li>{txoo.status? <div>Status: Success</div> : <div>Status: Failed</div>}</li>
  <li>Type: {txoo.type}</li>
  <li>Byzantium: {txoo.byzantium.toString()}</li>
</ul>
      )
    }
    setChose(true);
    setTxOutput(txRender);
  }
  getTxo()
}

function handleClick(event) {
    const buttonText = event.target.textContent;
    const numberString = buttonText.replace('Block Number: ', '');
    const number = parseInt(numberString);
    setClickedNum(number);
    async function clickedBlock() {
    const params = {
      blockNumber : String(Utils.hexlify(number))
    };
    const blockDeets = await alchemy.core.getBlock(String(Utils.hexlify(number)));
    const blockRaw = await alchemy.core.getTransactionReceipts(params);
    const blockRecp = blockRaw.receipts;
    blockDeets && delete blockDeets.transactions;
    const deetsRender = blockDeets && function() {
      return(
        <ul>
  <li>Block Hash: {blockDeets.hash}</li>
  <li>Parent Hash: {blockDeets.parentHash}</li>
  <li>Block Height: {blockDeets.number}</li>
  <li>Timestamp: {blockDeets.timestamp}</li>
  <li>Nonce: {blockDeets.nonce}</li>
  <li>Difficulty: {blockDeets.difficulty}</li>
  <li>Gas Limit: {BigInt(blockDeets.gasLimit._hex).toString()}</li>
  <li>Gas Used: {BigInt(blockDeets.gasUsed._hex).toString()}</li>
  <li>Miner: {blockDeets.miner}</li>
  <li>Base Fee: {Utils.formatEther(BigInt(blockDeets.baseFeePerGas._hex).toString())} ETH</li>
</ul>
      )
    }
    setBlockDetails(deetsRender);
  const clickElements = blockRecp && blockRecp.map((one, i) => (
    <ul key = {i}>
  <button className='App' onClick={handleTxo}>
  {one?.transactionHash}
  </button>
</ul>
  ));
  setClick(clickElements);
  setClicked(true);
    }
    clickedBlock();
} 
function adChange(evt) {
  const add = evt.target.value;
  setAddress(add); 
}
function getBal() {
if(address) {
  async function fetch() {
  const bal = await alchemy.core.getBalance(address);
  bal && setBalance(bal);
  }
  fetch()
}
}
const balCorrect = balance && Utils.formatEther(BigInt(balance).toString());

  useEffect(() => {
    async function getBlockNumber() {
      const blockNum = await alchemy.core.getBlockNumber();
      setBlockNumber(blockNum);
      const params = {
        blockNumber : String(Utils.hexlify(blockNum))
      };
      const txObject = blockNum && (await alchemy.core.getTransactionReceipts(params));
      const txRaw = txObject.receipts
      const gasPrice = await alchemy.core.getGasPrice();
      const gasNum = gasPrice && Utils.formatEther(BigInt(gasPrice._hex).toString());
      setGas(gasNum);
      setTransactions(txRaw);
     
    }
    getBlockNumber();
  }, [address]);

  return (
    <>
    <div className='App-header'>
      <div className='container'>
      <div className='lefti'>
       Gas Price : {parseInt(gas * 1000000000)} Gwei
        </div>
        <div className='righti'>
          <div className='container'>
          <div className='lefti'>Acoount Balance Checker (ETH)
        <input placeholder="Type a valid address" value={address} onChange={adChange} ></input>
        <input type="submit" className="button" onClick={getBal}/>
        </div> 
        <div className='righti'> Balance: {balCorrect} </div>
        </div>
        </div>
        </div>
        </div>
    <div className="container">
      <div className='left'>
        <h1>Latest Blocks</h1>
      <div>{numbers}</div>
      </div>
      <div className='right'>
      {clicked? <div className='container'> <div className='left'>
        <h1>Block {clickedNum}</h1>
      <div> {blockDetails} </div>
      <h2>Transactions</h2> 
      <div>{click}</div>
      </div>
      {chose && <div className='right'> {txOutput} </div>}
      </div> : <div className='container'> <div className='left'>
        <h1>Latest Transactions</h1>
      <div>{txo}</div>
      </div>
      {chose && <div className='right'> {txOutput} </div>}  
      </div>
      }
      </div>
      </div>
    </>
  );
  
}

export default App;
