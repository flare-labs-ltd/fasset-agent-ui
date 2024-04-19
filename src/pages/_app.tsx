import { MantineProvider } from '@mantine/core';
import type { AppProps } from "next/app";
import { defaultThemeOverride } from '@/config/theme';
import { GlobalStateChainIdWhenNotConnected } from '@/hooks/useNotConnectedChainProvider';
import { Web3Provider } from '@/hooks/useWeb3';
import { EthereumLoginProvider } from '@/hooks/useEthereumLogin';
import MainLayout from "@/components/layouts/MainLayout";
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RouteGuard from '@/components/RouteGuard';
import '@/i18n/config';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import "@/styles/globals.scss";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        },
    },
});

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
                                {Component.protected
                                    ? <RouteGuard>
                                        <Component {...pageProps} />
                                    </RouteGuard>
                                    : <Component {...pageProps} />
                                }
                            </MainLayout>
                        </EthereumLoginProvider>
                    </Web3Provider>
                </GlobalStateChainIdWhenNotConnected>
            </QueryClientProvider>
        </MantineProvider>
    );
}
