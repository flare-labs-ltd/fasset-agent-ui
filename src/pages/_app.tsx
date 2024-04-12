import { MantineProvider } from '@mantine/core';
import type { AppProps } from "next/app";
import { defaultThemeOverride } from '@/config/theme';
import { GlobalStateChainIdWhenNotConnected } from '@/lib/connect-wallet/hooks/useNotConnectedChainProvider';
import { Web3Provider } from '@/lib/connect-wallet/hooks/useWeb3';
import { EthereumLoginProvider } from '@/lib/connect-wallet/hooks/useEthereumLogin';
import { Notifications } from '@mantine/notifications';
import '@/i18n/config';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {

    return (
        <MantineProvider
            theme={{ ...defaultThemeOverride }}
        >
            <Notifications />
            <GlobalStateChainIdWhenNotConnected>
                <Web3Provider>
                    <EthereumLoginProvider>
                        <Component {...pageProps} />
                    </EthereumLoginProvider>
                </Web3Provider>
            </GlobalStateChainIdWhenNotConnected>
        </MantineProvider>
    );
}
