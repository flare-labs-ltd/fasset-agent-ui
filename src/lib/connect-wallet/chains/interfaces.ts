export interface INetworkParams {
    [chainId: number]: {
        name: string;
        shortName: string;
        chain: string;
        rpcUrls: string[];
        blockExplorerUrls: string[];
        contractRegistryAddress: string;
        dataProvidersInfo?: string[];
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        chainId: number;
        networkId: number;
        hrp: string | null;
    };
}
