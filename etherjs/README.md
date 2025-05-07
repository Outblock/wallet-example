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

## Send Transaction

```ts
// page.tsx
const sendTransaction = async (to: string, value: string) => {
  try {
    //@ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = {
      to: to,
      value: ethers.parseEther(value)
    };

    const transaction = await signer.sendTransaction(tx);
    await transaction.wait();

    // update balance
    const newBalance = await provider.getBalance(account);
    setBalance(ethers.formatEther(newBalance));

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
    const signer = await getSigner();

    // sign message
    const signature = await signer.signMessage(message);
    setSignature(signature);
    return {
      success: true,
      signature: signature,
      message: message
    };
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
    //@ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
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
