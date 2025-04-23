# Web3-Onboard
 
## Connect wallet to Flow EVM

```js
// page.tsx
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'

const WalletConnect = () => {
    
    // config flow network
    const onboard = Onboard({
    wallets: [injected],
    chains: [
      {
        id: '747',
        token: 'FLOW',
        label: 'Flow EVM Mainnet',
        rpcUrl: 'https://mainnet.evm.nodes.onflow.org'
      },
      {
        id: '545',
        token: 'FLOW',
        label: 'Flow EVM Testnet',
        rpcUrl: 'https://testnet.evm.nodes.onflow.org'
      }
    ]
  })
  
   // connect wallet
  const connectWallet = async () => {

      // request wallet connect
      const wallets = await onboard.connectWallet()

      if (wallets[0]) {
        setAccount(wallets[0].address)
        // create an ethers provider with the last connected wallet provider
        const ethersProvider = new ethers.BrowserProvider(flowWalletProvider, 'any')

        const { address } = wallets[0].accounts[0]

        const chainId = wallets[0].chains[0].id
        const balance = await ethersProvider.getBalance(address)

      }
  };
  
  return (
    <div>
       <button onClick={connectWallet}>Connect Wallet</button>
    <div/>
  )
}
```

