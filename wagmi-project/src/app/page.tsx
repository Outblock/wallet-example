'use client'

import { useAccount, useConnect, useDisconnect, useSignMessage, useVerifyMessage } from 'wagmi'
import { signMessage, getAccount, verifyMessage } from '@wagmi/core'
import { getConfig } from '../wagmi'
import { useState } from 'react'


function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const [result, setResult] = useState('')

  const config = getConfig()

  const sign = async () => {
    const msgString = `By connecting your wallet and using Mintify, you agree to our Terms of Service and Privacy Policy. \n\nMintify Connect`;
    const sig = await signMessageAsync({message: msgString})
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
        <button onClick={sign}>Sign Message</button>
        <div>{result}</div>
      </div>
    </>
  )
}

export default App
