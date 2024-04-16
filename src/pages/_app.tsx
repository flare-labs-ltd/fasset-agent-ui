import { MantineProvider } from '@mantine/core';
import type { AppProps } from "next/app";
import { defaultThemeOverride } from '@/config/theme';
import { GlobalStateChainIdWhenNotConnected } from '@/components/elements/connect-wallet/hooks/useNotConnectedChainProvider';
import { Web3Provider } from '@/components/elements/connect-wallet/hooks/useWeb3';
import { EthereumLoginProvider } from '@/components/elements/connect-wallet/hooks/useEthereumLogin';
import MainLayout from "@/components/layouts/MainLayout";
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from "react-redux";
import '@/i18n/config';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import "@/styles/globals.scss";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider
            theme={{ ...defaultThemeOverride }}
        >
            <Notifications />
            <QueryClientProvider client={queryClient}>
                <GlobalStateChainIdWhenNotConnected>
                    <Web3Provider>
                        <EthereumLoginProvider>
                            <MainLayout>
                                <Component {...pageProps} />
                            </MainLayout>
                        </EthereumLoginProvider>
                    </Web3Provider>
                </GlobalStateChainIdWhenNotConnected>
            </QueryClientProvider>
        </MantineProvider>
    );
}
