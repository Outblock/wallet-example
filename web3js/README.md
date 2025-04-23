# Web3js

## Connet wallet

```js
import Web3 from 'web3';

const WalletConnect = () => {

    // connect wallet
    const connectWallet = async () => {
        // init web3 
        const web3 = new Web3(flowWalletProvider);
        // connect wallet
        await flowWalletProvider.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
  
        const chainId = await web3.eth.getChainId();
        const balance = await web3.eth.getBalance(accounts[0]);
    
      };
  
  return (
     <div>
       <button onClick={connectWallet}>Connect Wallet</button>
     <div/>
  )
}
```


