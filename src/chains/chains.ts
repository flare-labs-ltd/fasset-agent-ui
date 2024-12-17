import { INetworkParams } from "./interfaces";

const FlareContractRegistry = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

export enum ChainIdName {
    Flare = 14,
    Songbird = 19,
    Coston = 16,
    Coston2 = 114,
}

export type AllSupportedChainsType =
    | ChainIdName.Flare
    | ChainIdName.Songbird
    | ChainIdName.Coston
    | ChainIdName.Coston2;

export const appChainParams: {
    supportedChains: AllSupportedChainsType[];
} = {
    supportedChains: [16, 19],
};

export const networkParams: INetworkParams = {
    14: {
        name: "Flare Mainnet",
        shortName: "Flare",
        chain: "FLR",
        rpcUrls: ["https://flare-api.flare.network/ext/C/rpc"],
        blockExplorerUrls: ["https://flare-explorer.flare.network"],
        contractRegistryAddress: FlareContractRegistry,
        nativeCurrency: {
            name: "Flare",
            symbol: "FLR",
            decimals: 18,
        },
        chainId: 14,
        networkId: 14,
        hrp: "flare",
    },
    16: {
        name: "Flare Testnet Coston",
        shortName: "Coston",
        chain: "CFLR",
        rpcUrls: ["https://coston-api.flare.network/ext/C/rpc"],
        blockExplorerUrls: ["https://coston-explorer.flare.network"],
        contractRegistryAddress: FlareContractRegistry,
        nativeCurrency: {
            name: "Coston Spark",
            symbol: "CFLR",
            decimals: 18,
        },
        chainId: 16,
        networkId: 16,
        hrp: null,
    },
    114: {
        name: "Flare Testnet Coston2",
        shortName: "Coston2",
        chain: "C2FLR",
        rpcUrls: ["https://coston2-api.flare.network/ext/C/rpc"],
        blockExplorerUrls: ["https://coston2-explorer.flare.network"],
        contractRegistryAddress: FlareContractRegistry,
        nativeCurrency: {
            name: "Coston2 Spark",
            symbol: "C2FLR",
            decimals: 18,
        },
        chainId: 114,
        networkId: 114,
        hrp: "costwo",
    },
    19: {
        name: "Songbird Canary-Network",
        shortName: "Songbird",
        chain: "SGB",
        rpcUrls: ["https://songbird-api.flare.network/ext/C/rpc"],
        blockExplorerUrls: ["https://songbird-explorer.flare.network"],
        contractRegistryAddress: FlareContractRegistry,
        nativeCurrency: {
            name: "Songbird",
            symbol: "SGB",
            decimals: 18,
        },
        chainId: 19,
        networkId: 19,
        hrp: null,
    },
};
