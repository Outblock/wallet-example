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
  const [provider, setProvider] = useState<any>(null)

  const providers = useSyncExternalStore(store.subscribe, store.getProviders, () => null)

  const getFlowWalletProvider = () => {
    return providers!.find(
      (provider: any) => provider.info.rdns === 'com.flowfoundation.wallet',
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

      // 签名消息
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
        </div>
      )}
    </div>
  );
};

export default WalletConnect;

