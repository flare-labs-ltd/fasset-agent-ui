import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { AppProps } from "next/app";
import type { NextComponentType } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultThemeOverride } from "@/config/theme";
import { Web3Provider } from "@/hooks/useWeb3";
import { EthereumLoginProvider } from "@/hooks/useEthereumLogin";
import MainLayout from "@/components/layouts/MainLayout";
import { ModalsProvider } from "@mantine/modals";
import RouteGuard from "@/components/RouteGuard";
import "@/config/i18n";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "@/styles/globals.scss";

type CustomAppProps = AppProps & {
    Component: NextComponentType & { protected?: boolean };
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        },
    },
});

export default function App({ Component, pageProps }: CustomAppProps) {

    return (
        <MantineProvider
            theme={{
                ...defaultThemeOverride,
            }}
        >
            <ModalsProvider>
                <Notifications />
                <QueryClientProvider client={queryClient}>
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
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    );
}
