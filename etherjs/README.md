# Etherjs

## Connect wallet

```js

// page.tsx

import { ethers } from 'ethers';

const WalletConnect = () => {
    
  // connect function
  const connectWallet = async () => {
      
      // connect wallet
      const accounts = await flowWalletProvider.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.BrowserProvider(flowWalletProvider);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);
   
  };
}

```
