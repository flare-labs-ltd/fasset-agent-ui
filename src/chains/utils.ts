import { AllSupportedChainsType, appChainParams, networkParams } from './chains';

export const chainIDs = Object.keys(networkParams).map((key) => parseInt(key, 10));

export const URLS: { [chainId: number]: string[] } = Object.keys(networkParams).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
    const validURLs: string[] = networkParams[Number(chainId)].rpcUrls;
    if (validURLs.length) {
        accumulator[Number(chainId)] = validURLs;
    }
    return accumulator;
}, {});

export const getChainName = (chainId: number | undefined) => {
    if (!chainId) return undefined;
    if (!(chainId in networkParams)) return;
    return networkParams[chainId].shortName;
};

export const isChainSupported = (chainId: number | undefined): AllSupportedChainsType | false => {
    //@ts-ignore
    if (!chainId || !appChainParams.supportedChains.includes(chainId)) return false;
    //@ts-ignore because we know that chainId is a one of the supported chains
    return chainId;
};

export const getChainExplorerUrl = (chainId: number) => {
    if (!chainId || !(chainId in networkParams)) return;
    return networkParams[chainId].blockExplorerUrls[0];
};
