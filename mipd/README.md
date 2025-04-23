# MIPD

## Connect wallet 

```js
// page.tsx

import { ethers, formatEther } from 'ethers'
import { createStore } from 'mipd'

const store = createStore()

const WalletConnect = () => {
    
    // get providers
    const providers = useSyncExternalStore(store.subscribe, store.getProviders, () => null) // return null of getSnapshot
    
    // find flow wallet provider or you can replace with others
    const getFlowWalletProvider = () => {
      return providers!.find(
        (provider: any) => provider.info.rdns === 'com.flowfoundation.wallet',
      );
    }
    
     // connect wallet func
    const connectWallet = async () => {
        const flowWalletProvider = getFlowWalletProvider()
        const accounts = await flowWalletProvider?.provider.request({
          method: 'eth_requestAccounts'
        });
        
        // wrap provider with etherjs
        let etherProvider = new ethers.BrowserProvider(flowWalletProvider?.provider)

        const network = await etherProvider.getNetwork();
        const chainId = network.chainId.toString()
        const balance = await etherProvider.getBalance(accounts[0])
    };
    
    
    return (
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
        <div/>
    )

}
```

