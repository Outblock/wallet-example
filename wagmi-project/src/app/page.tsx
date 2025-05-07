'use client'

import { useAccount, useConnect, useDisconnect, useSignMessage, useSignTypedData, useSendTransaction } from 'wagmi'
import { signMessage, getAccount, verifyMessage, verifyTypedData } from '@wagmi/core'
import { parseEther } from 'viem'
import { getConfig } from '../wagmi'
import { useState } from 'react'


function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { signTypedDataAsync } = useSignTypedData()
  const { sendTransactionAsync } = useSendTransaction()
  const [toAddress, setToAddress] = useState('');


  const [result, setResult] = useState('')
  const [signTypeSig, setSignTypeSig] = useState('');
  const [isTypedDataValid, setIsTypedDataValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');


  const config = getConfig()

  // EIP-712 Typed Data structures
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
  } as const

  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: account.chainId ?? 1, // Use connected chainId or a default
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC', // Example contract address
  } as const

  const message = {
    from: {
      name: 'Alice',
      wallet: account.address ?? '0x0000000000000000000000000000000000000000', // Use connected address or a default
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB', // Example recipient
    },
    contents: 'Hello, Bob!',
  } as const

  const handleSignTypedData = async () => {
    if (!account.address) {
      setErrorMsg('Please connect your wallet first.');
      return;
    }
    try {
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: 'Mail',
        message
      });
      setSignTypeSig(signature);
      setErrorMsg('');

      const isValid = await verifyTypedData(config, {
        address: account.address as `0x${string}`,
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: account.chainId ?? 1,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        types,
        primaryType: 'Mail',
        message,
        signature,
      });
      setIsTypedDataValid(isValid);
      console.log('Typed data signature:', signature);
      console.log('Typed data verification result:', isValid);
    } catch (err: any) {
      setErrorMsg('Sign typed data failed: ' + err.message);
      setSignTypeSig('');
      setIsTypedDataValid(null);
      console.error('Sign typed data error:', err);
    }
  };


  // send transaction
  const handleSendTransaction = async (to: string, amount: string) => {
    if (!sendTransactionAsync) {
      setErrorMsg('Send transaction function is not available.');
      return;
    }
    try {
      const hash = await sendTransactionAsync({
        to: to as `0x${string}`,
        value: parseEther(amount)
      })
      console.log('hash ==>', hash)
      return hash

    } catch (err: any) {
      setErrorMsg('Send transaction failed: ' + err.message);
    }
  };

  const sign = async () => {
    const msgString = `By connecting your wallet and using Mintify, you agree to our Terms of Service and Privacy Policy. \n\nMintify Connect`;
    const sig = await signMessageAsync({ message: msgString })
    console.log('sig ==>', sig)

    const result = await verifyMessage(config, {
      address: account.address as `0x${string}`,
      message: msgString,
      signature: sig
    })

    console.log('result ==>', result)
    setResult(result.toString())
  }

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
        <div>
          <input type="text" placeholder="Enter the recipient address" onChange={e => setToAddress(e.target.value)} />
          <br />
          <button onClick={() => handleSendTransaction(toAddress, '0.01')}>
            send 0.01 FLOW to {toAddress}
          </button>
        </div>
        <br />
        <button onClick={sign}>Sign Message</button>
        <div>{result}</div>

        <div>
          <button onClick={handleSignTypedData}>
            Sign Typed Data
          </button>
          <br />
          {signTypeSig && <p>Signature: {signTypeSig}</p>}
          {isTypedDataValid !== null && <p>Is Valid: {isTypedDataValid.toString()}</p>}
          {errorMsg && <p style={{ color: 'red' }}>Error: {errorMsg}</p>}
        </div>
      </div>
    </>
  )
}

export default App
