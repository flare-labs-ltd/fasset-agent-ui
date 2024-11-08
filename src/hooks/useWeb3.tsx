import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
    useWeb3React,
    Web3ContextType as Web3ReactContextType,
    Web3ReactProvider
} from "@web3-react/core";
import type { Web3Provider as BaseWeb3Provider } from "@ethersproject/providers";
import {AllSupportedChainsType, appChainParams} from "@/chains/chains";
import { isChainSupported } from "@/chains/utils";
import connectors, { enabledWallets } from "@/connectors/connectors";
import { connectEagerlyOnRefreshLocalStorage } from "@/utils";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Network } from "@web3-react/network";
import { useRouter } from "next/router";
import { useGlobalStateChainIdWhenNotConnected } from "@/hooks/useNotConnectedChainProvider";

/**
 * Extended base web3react provider to support other functionality as well
 */
type Web3ContextType = {
    supportedChainId: false | AllSupportedChainsType;
    isConnected: boolean;
    isAuthenticated: boolean;
    isInitializing: boolean;
    connect: (connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network, chainId?: number) => Promise<void>;
    disconnect: (connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network) => Promise<void>;
    setAuthenticated: (status: boolean) => void;
} & Web3ReactContextType<BaseWeb3Provider>;

const Web3Context = createContext<Web3ContextType | null>(null);

export const ExtendedWeb3Provider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const web3React = useWeb3React<BaseWeb3Provider>();
    const { chainId } = web3React;
    const supportedChainId = isChainSupported(chainId);
    const { notConnectedChainId } = useGlobalStateChainIdWhenNotConnected();
    const router = useRouter();

    /**
     * Try to connect WalletConnect
     * attempt to connect eagerly on mount
     * it's placed here so that it runs on page load, and not only on modal open
     * Only connect eagerly on last connected chain
     */
    useEffect(() => {
        const token = window.localStorage.getItem('FASSET_TOKEN');
        if (token) {
            setIsAuthenticated(true);
        }

        const getConnectedAccount = async() => {
            const accounts = await connectEagerlyOnRefreshLocalStorage();
            setIsInitializing(accounts === undefined);
            if (accounts === undefined) return;

            setIsConnected(accounts.length > 0);
        }

        getConnectedAccount();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts: string[]) => {
                const connectionData = window.localStorage.getItem('ACTIVE_CONNECTION');
                if (connectionData !== null) {
                    const data = JSON.parse(connectionData);

                    if (data.wallet == 'MetaMask') {
                        if (accounts.length > 0) {
                            const desiredChainId = notConnectedChainId || appChainParams.desiredChainID;
                            await connect(enabledWallets.metamask.connector, desiredChainId);
                            await router.push('/');
                        } else {
                            await router.push('/connect');
                        }
                    }
                }
            })
        }
    }, []);

    const connect = async(connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network, chainId?: number) => {
        connector instanceof WalletConnectV2
            ? await connector.activate()
            : await connector.activate(chainId);
        setIsConnected(true);
    }

    const disconnect = async(connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network) => {
        connector?.deactivate
            ? await connector.deactivate()
            : await connector.resetState();

        window.localStorage.setItem(
            'ACTIVE_CONNECTION',
            JSON.stringify({
                wallet: undefined,
            })
        );
        Object.keys(localStorage)
            .filter((item) => item.startsWith('wc@'))
            .forEach((item) => localStorage.removeItem(item));
        setIsConnected(false);
    }

    const setAuthenticated = (status: boolean) => {
        setIsAuthenticated(status);
    }

    const value = useMemo(
        () => ({
            supportedChainId,
            isConnected,
            connect,
            disconnect,
            isInitializing,
            isAuthenticated,
            setAuthenticated
        }),
        [
            supportedChainId,
            isConnected,
            connect,
            disconnect,
            isInitializing,
            isAuthenticated,
            setAuthenticated
        ],
    );

    return (
        <Web3Context.Provider
            value={{
                ...value,
                ...web3React,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

export const Web3Provider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    return (
        <Web3ReactProvider connectors={connectors}>
            <ExtendedWeb3Provider>
                {children}
            </ExtendedWeb3Provider>
        </Web3ReactProvider>
    );
};

export function useWeb3(): Web3ContextType {
    const value = useContext(Web3Context);

    if (!value) {
        throw new Error('Must be used inside Web3-React provider');
    }

    return value as NonNullable<Web3ContextType>;
}
