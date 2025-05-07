"use client"
import React, { useState, useSyncExternalStore } from 'react';
import { ethers, formatEther } from 'ethers'
import { createStore } from 'mipd'


const store = createStore()

const WalletConnect = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [chainId, setChainId] = useState('');
  const [error, setError] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [signTypeSig, setSignTypeSig] = useState('');
  const [provider, setProvider] = useState<any>(null)

  const providers = useSyncExternalStore(store.subscribe, store.getProviders, () => null)

  const types = {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  }

  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 747,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  } as const

  const typeMsg = {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  }

  const typedData = {
    types,
    domain,
    primaryType: "Mail",
    message
  }

  const getFlowWalletProvider = () => {
    return providers!.find(
      (provider: any) => {
        let flag = provider.info.rdns === 'com.flowfoundation.wallet'
        return flag
      },
    );
  }

  // connect wallet
  const connectWallet = async () => {
    try {
      const flowWalletProvider = getFlowWalletProvider()
      setProvider(flowWalletProvider?.provider)
      const accounts = await flowWalletProvider?.provider.request({
        method: 'eth_requestAccounts'
      });
      let etherProvider = new ethers.BrowserProvider(flowWalletProvider?.provider)
      setProvider(etherProvider)
      const network = await etherProvider.getNetwork();
      const chainId = network.chainId.toString()
      const balance = await etherProvider.getBalance(accounts[0])

      setAccount(accounts);
      setChainId(chainId.toString());
      setBalance(formatEther(balance).toString());
      setError('');

    } catch (err: any) {
      setError('Connect wallet failed:' + err.message);
    }
  };


  // send transaction
  const sendTransaction = async (to: string, amount: string) => {
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

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Address：{account}</p>
          <p>Balance：{balance} FLOW</p>
          <p>Chain ID: {chainId}</p>


          <div>
            <input type="text" placeholder="Enter the recipient address" onChange={e => setToAddress(e.target.value)} />
            <br />
            <button onClick={() => sendTransaction(toAddress, '0.01')}>
              send 0.01 FLOW to {toAddress}
            </button>
          </div>

          <div>
            <input type="text" placeholder="Enter the message to sign" onChange={e => setMessage(e.target.value)} />
            <br />
            <button onClick={() => signMessage(message)}>
              Sign Message
            </button>
            <br />
            <p>Signature: {JSON.stringify(signature)}</p>
          </div>

          <div>
            <button onClick={() => signTypeData()}>
              Sign type data
            </button>
            <br />
            <p>Signature: {JSON.stringify(signTypeSig)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;

