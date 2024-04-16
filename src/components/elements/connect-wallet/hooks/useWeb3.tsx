import React, { createContext, useContext, useEffect } from 'react';
import { useWeb3React, Web3ContextType as Web3ReactContextType, Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import { AllSupportedChainsType } from '../chains/chains';
import { isChainSupported } from '../chains/utils';
import connectors from '../connectors/connectors';
import { connectEagerlyOnRefreshLocalStorage } from '../utils';
import { GlobalChainSwapperProvider } from '../hooks/useAutoChainSwapper';

/**
 * Extended base web3react provider to support other functionality as well
 */
type Web3ContextType = {
    supportedChainId: false | AllSupportedChainsType;
} & Web3ReactContextType<providers.Web3Provider>;

const Web3Context = createContext<Web3ContextType | null>(null);

export const ExtendedWeb3Provider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    const web3React = useWeb3React<providers.Web3Provider>();
    const { chainId } = web3React;

    const supportedChainId = isChainSupported(chainId);

    /**
     * Try to connect WalletConnect
     * attempt to connect eagerly on mount
     * it's placed here so that it runs on page load, and not only on modal open
     * Only connect eagerly on last connected chain
     */
    useEffect(() => {
        connectEagerlyOnRefreshLocalStorage();
    }, []);

    /**
     * TODO
     * do we want to force to user to change chain on every page focus?
     */

    return (
        <Web3Context.Provider
            value={{
                supportedChainId,
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
                <GlobalChainSwapperProvider>{children}</GlobalChainSwapperProvider>
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
