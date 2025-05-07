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

## Send Transaction

```ts
// page.tsx
const sendTransaction = async (to: string, value: string) => {
  try {
    //@ts-ignore
    const web3 = new Web3(flowWalletProvider);
    const accounts = await web3.eth.getAccounts();

    const from = accounts[0];

    // convert ETH to Wei
    const value = web3.utils.toWei(amount, "ether");

    // get gas price
    const gasPrice = await web3.eth.getGasPrice();

    // estimate gas
    const gasEstimate = await web3.eth.estimateGas({
      from,
      to,
      value,
    });

    // build transaction
    const tx = {
      from,
      to,
      value,
      gas: gasEstimate,
      gasPrice,
    };

    // send transaction
    const receipt = await web3.eth.sendTransaction(tx);

    return {
      success: true,
      hash: receipt.transactionHash,
      receipt,
    };
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
    //@ts-ignore
    const web3 = new Web3(flowWalletProvider);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];

    // convert message to hex
    const messageHex = web3.utils.utf8ToHex(message);

    // sign message
    const signature = await web3.eth.personal.sign(
      messageHex,
      from,
      "" // password (empty for MetaMask)
    );

    setSignature(signature);

    return {
      success: true,
      message,
      signature,
    };
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
    if (!flowWalletProvider || !account || !chainId) {
      setError("Wallet not connected or chainId not available");
      return;
    }

    const currentChainId = parseInt(chainId, 747);
    const messageDomain = {
      ...domain,
      chainId: currentChainId, // Ensure chainId is a number
    };

    const eip712Payload = {
      types: types,
      primaryType: "Mail",
      domain: messageDomain,
      message: typeMsg,
    };

    //@ts-ignore
    const signature = await flowWalletProvider.request({
      method: "eth_signTypedData_v4",
      params: [account, JSON.stringify(eip712Payload)],
    });

    setSignTypeSig(signature);
    setError("");
    return signature;
  } catch (err: any) {
    console.error("Sign typed data error:", err);
    setError("Sign typed data failed: " + err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};
```
