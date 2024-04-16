import { tokens } from './chains/tokens';
import { providers } from 'ethers';
import { AllSupportedChainsType } from './chains/chains';
import { coinbaseWallet } from './connectors/coinbaseWallet';
import { metaMask } from './connectors/metaMask';
import { walletConnectV2 } from './connectors/walletConnectV2';

export const addWrappedToken = async (provider: providers.Web3Provider | undefined, chainID: AllSupportedChainsType) => {
    if (!provider || !provider.provider.request) return;
    try {
        const watchAsset = await provider.provider.request({
            method: 'wallet_watchAsset',
            params: {
                // @ts-ignore
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: tokens[chainID],
            },
        });

        return watchAsset;
    } catch (error) {
        console.log('Watching token error', error);
    }
};

export const connectEagerlyOnRefreshLocalStorage = async () => {
    const connectionData = window.localStorage.getItem('ACTIVE_CONNECTION');
    if (connectionData !== null) {
        const data = JSON.parse(connectionData);
        if (data.wallet == 'MetaMask') {
            metaMask.connectEagerly().catch(() => {
                console.debug('Failed to connect eagerly to wallet');
            });
        }
        if (data.wallet == 'WalletConnect') {
            walletConnectV2.connectEagerly().catch(() => {
                console.debug('Failed to connect eagerly to wallet');
            });
        }
        if (data.wallet == 'CoinbaseWallet') {
            coinbaseWallet.connectEagerly().catch(() => {
                console.debug('Failed to connect eagerly to wallet');
            });
        }
    }
};
