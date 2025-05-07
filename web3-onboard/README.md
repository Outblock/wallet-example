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

## Send Transaction

```ts
// page.tsx
const sendTransaction = async (to: string, value: string) => {
  try {
    const signer = await provider.getSigner();

    const txn = await signer.sendTransaction({
      to: to,
      value: ethers.parseEther(amount),
    });

    const receipt = await txn.wait();
    console.log(receipt);
    return receipt;
  } catch (err: any) {
    setError("Send transaction failed:" + err.message);
  }
};
```

## Sign Message

```ts
// page.tsx
const signMessage = async (message: string) => {
  try {
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    setSignature(signature);

    return signature;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
```

## Sign Typed Data (EIP-712)

```ts
// page.tsx
const signTypeData = async () => {
  try {
    const signer = await provider.getSigner();
    // Ethers.js uses `signTypedData` for EIP-712 signing
    const signature = await signer.signTypedData(domain, types, typeMsg);
    setSignTypeSig(signature);
    setError("");
    return signature;
  } catch (err: any) {
    setError("Sign typed data failed:" + err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};
```
