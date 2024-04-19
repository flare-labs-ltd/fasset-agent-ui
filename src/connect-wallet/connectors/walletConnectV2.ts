import { appChainParams } from '../chains/chains';
import { URLS } from '../chains/utils';
import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';


// get chain data
const CHAINS = [appChainParams.desiredChainID]
const OPTIONAL_CHAINS = appChainParams.supportedChains.filter((chain) => chain != appChainParams.desiredChainID)

// chain swapping not yet supported by METAMASK!
// when fixed bugs by metamask also fix chains list to be according to walletconnect documentation
export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
    (actions) =>
        new WalletConnectV2({
            actions,
            options: {
                projectId: process.env.WALLETCONNECT_PROJECT_ID || '',
                // just one in array for now because of metamask issue: https://github.com/MetaMask/metamask-mobile/issues/3090
                // https://github.com/MetaMask/metamask-mobile/issues/6670
                // so at least it works somehow but still not really -.-
                chains: CHAINS,
                // this needs to be added because walletconnect by default does not know our rpc urls...
                rpcMap: URLS,
                // same because of metamask issue  https://github.com/MetaMask/metamask-mobile/issues/3090 so we just add all other as optional chains
                optionalChains: OPTIONAL_CHAINS,
                showQrModal: true,
                optionalMethods: ["wallet_switchEthereumChain", "wallet_addEthereumChain",'eth_sign'],
                qrModalOptions: {
                    themeVariables: {
                        '--wcm-z-index': '100',
                    },
                },
            },
        })
);
