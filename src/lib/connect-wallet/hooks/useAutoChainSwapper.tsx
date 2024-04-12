import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { isDesktop } from 'react-device-detect';
import { useRouter } from 'next/router';
import Web3 from 'web3';
import { showNotification } from '@mantine/notifications';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { AllSupportedChainsType, appChainParams, networkParams } from '../chains/chains';
import { chainIDs } from '../chains/utils';
import { useIsPageVisible } from './useIsPageVisible';
import { useGlobalStateChainIdWhenNotConnected } from './useNotConnectedChainProvider';
import { addWrappedToken } from '../utils';
import { useWeb3 } from '../hooks/useWeb3';

type UseChainSwapperContextType = {
    switchToChain: (targetChainId: AllSupportedChainsType) => Promise<void>;
};

const ChainSwapperContextType = createContext<UseChainSwapperContextType | null>(null);

export const GlobalChainSwapperProvider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    const { provider, chainId, supportedChainId, isActive, account, connector } = useWeb3();

    const router = useRouter();

    const isPageVisible = useIsPageVisible();
    const switchingChain = useRef<boolean>(false);

    const { notConnectedChainId } = useGlobalStateChainIdWhenNotConnected();

    /**
     * @param targetChainId target chain number (must be supported)
     *
     * @dev currently Wallet Connect doesn't work on connection via pc-mobile (known Metamask error)
     * https://github.com/MetaMask/metamask-mobile/issues/3546
     */
    const switchToChain = useCallback(
        async (targetChainId: AllSupportedChainsType) => {
            if (!chainIDs.includes(targetChainId)) return; // ignore if it is not a supported network
            if (!provider) return; // separate returns in case we want to have custom errors here
            if (switchingChain.current) return; // ignore if we are already switching

            const targetNetwork = networkParams[targetChainId];
            if (chainId !== targetChainId && provider.provider.request) {
                switchingChain.current = true;
                try {
                    await provider.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: Web3.utils.numberToHex(targetChainId) }],
                    });
                    // testing if that would solve issues on iphone in metamask app
                    // on desktop it is recommented to refresh page when switching network
                    // on iphone it seems that sometimes that cause some problems
                    if (isDesktop) {
                        router.reload();
                    }
                } catch (err: any) {
                    if (err.code === 4001) {
                        showNotification({
                            id: 'ChainSwap',
                            title: 'Error',
                            message: `${(err as any).message}`,
                            autoClose: 5000,
                            color: 'red',
                        });
                    }
                    if (err.code === 4902 || err.code === -32603 || err.data?.originalError?.code === 4902 || err.code === -32000) {
                        // This error code indicates that the chain has not been added to Provider
                        try {
                            if (!provider.provider.request) return;
                            await provider.provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainName: targetNetwork.name,
                                        chainId: Web3.utils.toHex(targetNetwork.chainId),
                                        rpcUrls: targetNetwork.rpcUrls,
                                        nativeCurrency: targetNetwork.nativeCurrency,
                                        blockExplorerUrls: targetNetwork.blockExplorerUrls,
                                    },
                                ],
                            });

                            // ultimate lifehack...
                            // I believe that chain is not added immediatly when request resolves
                            await new Promise((r) => setTimeout(r, 200));
                            // await connector.activate(targetChainId);

                            // A bit hacky we need to do that since coinbase wallet throw error even if switch chain is successful
                            // similar to open github issue  https://github.com/rainbow-me/rainbowkit/issues/1524
                            // this error occurs only when using coinbase extension
                            // switching chains is still working properly
                            // the cause is that coinbase wallet tries to get chain data but if the chain is not whitelisted it returns error
                            // even thought we already added chain with 'wallet_addEthereumChain'
                            if (connector instanceof CoinbaseWallet) {
                                try {
                                    const res = await provider.send('wallet_switchEthereumChain', [{ chainId: Web3.utils.toHex(targetChainId) }]);
                                } catch (error) {
                                    console.error('Coinbase wallet error', error);
                                }
                            } else {
                                await provider.provider.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: Web3.utils.toHex(targetChainId) }],
                                });
                            }
                            await new Promise((r) => setTimeout(r, 200));
                            if (!(connector instanceof CoinbaseWallet)) await addWrappedToken(provider, targetChainId);
                            // only do full page reload when on desktop switching chain to get clear session
                            // on mobile metamask browser full refresh causes some issues so we don`t refresh it
                            if (isDesktop) {
                                router.reload();
                            }
                        } catch (error: any) {
                            console.error('here is the error', error);
                            showNotification({
                                id: 'ChainSwap',
                                title: 'Error',
                                message: `${(error as any).message}`,
                                autoClose: 5000,
                                color: 'red',
                            });
                        }
                    }
                }

                /**
                 * If we have a provider, which is not activated
                 * we try to connect it forcefully
                 */
                //seem like sometimes causes problems expecialy if want to connect to other wallet after connected to metamask
                // if (provider && !isActive) {
                //    metaMask.activate().catch(() => {
                //       console.debug('Unable to connect to metamask');
                //    });
                // }

                switchingChain.current = false;
            }
        },
        [provider, chainId, connector, router]
    );

    useEffect(() => {
        const asyncEffect = async () => {
            if (!provider || !account || !chainId || !isPageVisible) return;

            if (!supportedChainId) {
                await switchToChain(appChainParams.desiredChainID);
            }
        };
        asyncEffect();
    }, [provider, account, chainId, isPageVisible, supportedChainId, switchToChain, notConnectedChainId]);

    return (
        <ChainSwapperContextType.Provider
            value={{
                switchToChain,
            }}
        >
            {children}
        </ChainSwapperContextType.Provider>
    );
};

export function useChainSwapper(): UseChainSwapperContextType {
    const value = useContext(ChainSwapperContextType);

    if (!value) {
        throw new Error('Must be used inside Web3 provider');
    }

    return value as NonNullable<UseChainSwapperContextType>;
}
