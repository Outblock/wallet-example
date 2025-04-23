# Wagmi

## Config wagmi with Chains and providers

```js

// config.ts file
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { flowMainnet, flowTestnet} from 'wagmi/chains'

export function getConfig() {
  return createConfig({
    chains: [flowMainnet, flowTestnet],
    connectors: [
      injected(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [flowMainnet.id]: http(),
      [flowTestnet.id]: http(),
    },
  })
}

``` 

## Connect injected wallet with Flow EVM 

```js
// page.ts
import { useAccount, useConnect, useDisconnect, useSignMessage, useVerifyMessage } from 'wagmi'
import { signMessage, getAccount, verifyMessage } from '@wagmi/core'
import { getConfig } from '../config'

function App() {
    const config = getConfig()

    const account = useAccount()
    const { connectors, connect, status, error } = useConnect()

    return (
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
        <div/>
    )
}
```

