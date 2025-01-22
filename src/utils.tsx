import { coinbaseWallet } from '@/connectors/coinbaseWallet';
import { metaMask } from '@/connectors/metaMask';
import { walletConnectV2 } from '@/connectors/walletConnectV2';
import UsdcIcon from "@/components/icons/UsdcIcon";
import UsdtIcon from "@/components/icons/UsdtIcon";
import CflrIcon from "@/components/icons/CflrIcon";
import XrpIcon from "@/components/icons/XrpIcon";
import EthIcon from "@/components/icons/EthIcon";
import BtcIcon from "@/components/icons/BtcIcon";
import DogeIcon from "@/components/icons/DogeIcon";
import SgbIcon from "@/components/icons/SgbIcon";

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

export const isNumeric = (value: string | number | boolean | undefined | null) => {
    if (value === undefined || value === null) {
        return false;
    }
    if (isBoolean(value)) {
        return false;
    }

    return typeof value === 'number'
        ? true
        : /^[+-]?\d+(\.\d+)?$/.test(value as string);
}

export const isBoolean = (val: any) => {
    return val === false || val === true;
}

export const toNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
}

export const isMaxCRValue = (value: string | undefined | null) => {
    if (value === '<inf>') {
        return true;
    }
    if (value !== null && value !== undefined && isNumeric(value)) {
        return Number(value.replace(/,/g, '')) >= 1000;
    }
    return false;
}

export const getIcon = (token: string, size: string) => {
    if (token.toLowerCase().includes('usdc')) {
        return <UsdcIcon width={size} height={size} className="flex-shrink-0" />;
    } else if (token.toLowerCase().includes('usdt')) {
        return <UsdtIcon width={size} height={size} className="flex-shrink-0" />;
    } else if (token.toLowerCase().includes('flr')) {
        return <CflrIcon width={size} height={size} className="flex-shrink-0" />;
    } else if (token.toLowerCase().includes('xrp')) {
        return <XrpIcon width={size} height={size} className="flex-shrink-0" />;
    } else if (token.toLowerCase().includes('eth')) {
        return <EthIcon width={size} height={size} className="flex-shrink-0" />;
    } else if (token.toLowerCase().includes('btc')) {
        return <BtcIcon width={size} height={size} className="flex-shrink-0" />;
    } else if (token.toLowerCase().includes('doge')) {
        return <DogeIcon width={size} height={size} className="flex-shrink-0" />;
    } else if (token.toLowerCase().includes('sgb')) {
        return <SgbIcon width={size} height={size} className="flex-shrink-0" />;
    }
}

export function formatNumber(value: string | number, fractionDigits: number = 2, locale = 'en-US') {
    if (typeof value === 'number') {
        return value.toLocaleString(locale, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    }

    return toNumber(value).toLocaleString(locale, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
}
