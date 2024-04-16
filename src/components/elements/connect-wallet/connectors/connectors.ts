import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { Web3ReactHooks } from '@web3-react/core';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { hooks as metaMaskHooks, metaMask } from './metaMask';
import { walletConnectV2, hooks as walletConnectV2Hooks } from './walletConnectV2';
import { coinbaseWallet, hooks as coinbaseWalletHooks } from './coinbaseWallet';
import { hooks as networkHooks, network } from './network';
import BifrostWalletIcon from '../images/BifrostWalletIcon';
import CoinbaseWalletIcon from '../images/CoinbaseWalletIcon';
import MetamaskIcon from '../images/MetamaskIcon';
import WalletConnectIcon from '../images/WalletConnectIcon';

export type SupportedWallets = 'bifrost' | 'coinbase' | 'metamask' | 'walletConnect';

export interface IIconProps {
    width?: string;
    height?: string;
}
export interface IEnabledWallet {
    name: string;
    icon: (props: IIconProps) => JSX.Element;
    connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network;
    hooks: Web3ReactHooks;
}

export const enabledWallets: { [wallet in SupportedWallets]: IEnabledWallet; } = {
    metamask: {
        name: 'Metamask',
        icon: MetamaskIcon,
        connector: metaMask,
        hooks: metaMaskHooks,
    },
    bifrost: {
        name: 'Bifrost Wallet',
        icon: BifrostWalletIcon,
        connector: metaMask,
        hooks: metaMaskHooks,
    },
    walletConnect: {
        name: 'Wallet Connect',
        icon: WalletConnectIcon,
        connector: walletConnectV2,
        hooks: walletConnectV2Hooks,
    },
    coinbase: {
        name: 'Coinbase Connect',
        icon: CoinbaseWalletIcon,
        connector: coinbaseWallet,
        hooks: coinbaseWalletHooks,
    }
}

const connectors: [MetaMask][] = [
    [metaMask, metaMaskHooks],
    [walletConnectV2, walletConnectV2Hooks],
    [coinbaseWallet, coinbaseWalletHooks],
    [network, networkHooks],
];

export default connectors;
