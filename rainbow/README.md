
## Rainbowkit


### Connect wallet to Flow EVM

```ts
// _app.tsx config provider
import {NextUIProvider} from "@nextui-org/react";
import type { AppProps } from 'next/app';
import {RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';


function MyApp({ Component, pageProps }: AppProps) {

    return (
        <NextUIProvider>
            <OtherProvider>
                <RainbowKitProvider theme={darkTheme()}>
                      <main className="dark text-foreground bg-background">
                        <Component {...pageProps} />
                      </main>
                  </RainbowKitProvider>
             <OtherProvider/>
         <NextUIProvider/>
    )    
}
```

```ts
// index.ts import connectButton
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Home: NextPage = () => {
    return (
        <main className={styles.main}>
            <h1>Flow EVM Demo</h1>
            <ConnectButton showBalance={true} />
        <main/>
    )
}
```


