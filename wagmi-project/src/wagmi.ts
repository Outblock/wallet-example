import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { flowMainnet, flowPreviewnet, flowTestnet, mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [mainnet, flowMainnet, flowTestnet, flowPreviewnet],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: 'c284f5a3346da817aeca9a4e6bc7f935' }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      // [sepolia.id]: http(),
      [flowMainnet.id]: http(),
      [flowTestnet.id]: http(),
      [flowPreviewnet.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
