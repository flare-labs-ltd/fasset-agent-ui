import { coinbaseWallet } from '@/connectors/coinbaseWallet';
import { metaMask } from '@/connectors/metaMask';
import { walletConnectV2 } from '@/connectors/walletConnectV2';

export const connectEagerlyOnRefreshLocalStorage = async (): Promise<string[]|undefined> => {
    const connectionData = window.localStorage.getItem('ACTIVE_CONNECTION');
    if (connectionData !== null) {
        const data = JSON.parse(connectionData);

        if (data.wallet == 'MetaMask') {
            return metaMask.connectEagerly()
                .then(async(): Promise<string[]|undefined> => {
                    //@ts-ignore
                    return await metaMask?.provider?.request({ method: 'eth_accounts' });
                })
                .catch(error => {
                    return undefined
                });
        }
        if (data.wallet == 'WalletConnect') {
            return walletConnectV2.connectEagerly()
                .then(() => {
                    return walletConnectV2?.provider?.accounts;
                })
                .catch(error => {
                    return undefined;
                });
        }
        if (data.wallet == 'CoinbaseWallet') {
            return coinbaseWallet.connectEagerly()
                .then(async(): Promise<string[]|undefined> => {
                    //@ts-ignore
                    return await coinbaseWallet?.provider?.request({ method: 'eth_accounts' });
                })
                .catch(error => {
                    return undefined;
                });
        }
    }

    return [];
};

export const truncateString = (text: string, from: number = 4, to: number = 4) => {
    return `${text.substring(0, from)}...${text.substring(text.length - to, text.length)}`;
}


export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
}
