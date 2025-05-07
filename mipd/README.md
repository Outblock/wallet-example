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

## Send Transaction

```ts
// page.tsx
const sendTransaction = async (to: string, value: string) => {
  try {
      const signer = await provider.getSigner();

      const tx = {
        to: to,
        value: ethers.parseEther(amount)
      };

      const transaction = await signer.sendTransaction(tx);
      await transaction.wait();

      // 更新余额
      const newBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(newBalance));

      return transaction

    } catch (err: any) {
      setError('Send transaction failed:' + err.message);
    }
};
```

## Sign Message

```ts
// page.tsx
const signMessage = async (message: string) => {
   try {
      const signer = await provider.getSigner()

      const signature = await signer.signMessage(message);
      setSignature(signature);

      return signature
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
}
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
      setError('');
      return signature;
    } catch (err: any) {
      setError('Sign typed data failed:' + err.message);
      return {
        success: false,
        error: err.message
      };
    }
}
```

