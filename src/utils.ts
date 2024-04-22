import { coinbaseWallet } from '@/connectors/coinbaseWallet';
import { metaMask } from '@/connectors/metaMask';
import { walletConnectV2 } from '@/connectors/walletConnectV2';

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