# Viem

## Connect wallet to Flow EVM

```js
// page.tsx
import { createWalletClient, custom, http } from 'viem'
import { flowMainnet, flowTestnet } from 'viem/chains'

const WalletConnect = () => {

  // connect wallet function
  const connectWallet = async () => {
    try {
      const client = createWalletClient({
        chain: flowMainnet,
        transport: custom(flowWalletProvider!)
      })

      // request user to connect wallet
      const [address] = await client.getAddresses()
      const chainId = await client.getChainId(); // get chain id

    } catch (err: any) {
      console.log('Connect wallet failed:' + err.message);
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
    const client = createWalletClient({
      chain: flowMainnet,
      //@ts-ignore
      transport: custom(flowWalletProvider),
    });
    const [address] = await client.getAddresses();

    // send transaction
    const hash = await client.sendTransaction({
      account: address,
      to: toAddress as `0x${string}`,
      value: parseEther("0.01"),
    });

    return hash;
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
    const client = createWalletClient({
      chain: flowMainnet,
      //@ts-ignore
      transport: custom(window.ethereum!),
    });
    const [address] = await client.getAddresses();

    const signature = await client.signMessage({ account: address, message });

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
    const client = createWalletClient({
      chain: flowMainnet,
      //@ts-ignore
      transport: custom(flowWalletProvider),
    });
    const signature = await client.signTypedData({
      account: account as `0x${string}`,
      domain,
      types,
      primaryType: "Mail",
      message: typeMsg,
    });
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
