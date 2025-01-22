export interface ISecretsTemplate {
    apiKey: {
        agent_bot: string;
        indexer: string;
        native_rpc: string;
        xrp_rpc: string;
    },
    owner: {
        management: {
            address: string;
        },
        native: {
            address: string;
            private_key: string;
        },
        testXRP: {
            address: string;
            private_key: string;
        },
        wallet: {
            encryption_password: string;
        }
    }
}

export interface IVaultCollateral {
    collaterals: { symbol: string, template: string}[],
    fassetSymbol: string;
}

export interface ICollateralItem {
    symbol: string;
    balance: string;
    wrapped?: string;
}

export interface ICollateral {
    fassetSymbol: string;
    collaterals: ICollateralItem[]
}

export interface IBotAlert {
    id: number;
    bot_type: string;
    address: string;
    level: string;
    title: string;
    description: string;
    expiration: number;
    date: string;
}

export interface IBotAlerts {
    alerts: IBotAlert[];
    count: number;
}

export interface INotification {
    id: number;
    messages: string;
    time: string;
}

export interface IVault {
    address: string;
    freeLots: string;
    mintedAmount: string;
    mintedlots: string;
    poolAmount: string;
    poolCR: string;
    status: boolean;
    updating: boolean;
    vaultAmount: number;
    vaultCR: string;
    agentCPTs: string;
    collateralToken: string;
    numLiquidations: number;
    createdAt: number;
    fasset: string;
    health: string;
    lotsPoolBacked: string;
    lotsVaultBacked: string;
    poolFee: string;
    mintCount: string;
    handshakeType: number;
    delegationPercentage: string;
    delegates: {
        address: string;
        delegation: string;
    }[];
}

export interface IAgentSettingsDTO {
    name: string;
    value: string;
}

export interface IAgentSettingsConfig {
    poolTokenSuffix: string;
    vaultCollateralFtsoSymbol: string;
    fee: string;
    poolFeeShare: string;
    mintingVaultCollateralRatio: string;
    mintingPoolCollateralRatio: string;
    poolExitCollateralRatio: string;
    buyFAssetByAgentFactor: string;
    poolTopupCollateralRatio: string;
    poolTopupTokenPriceFactor: string;
    handshakeType: number;
}

export interface IAgentVault {
    status: string;
    ownerManagementAddress: string;
    ownerWorkAddress: string;
    collateralPool: string;
    underlyingAddressString: string;
    publiclyAvailable: boolean;
    feeBIPS: string;
    poolFeeShareBIPS: string;
    vaultCollateralToken: string;
    mintingVaultCollateralRatioBIPS: string;
    mintingPoolCollateralRatioBIPS: string;
    freeCollateralLots: string;
    totalVaultCollateralWei: string;
    freeVaultCollateralWei: string;
    vaultCollateralRatioBIPS: string;
    totalPoolCollateralNATWei: string;
    freePoolCollateralNATWei: string;
    poolCollateralRatioBIPS: string;
    totalAgentPoolTokensWei: string;
    announcedVaultCollateralWithdrawalWei: string;
    announcedPoolTokensWithdrawalWei: string;
    freeAgentPoolTokensWei: string;
    mintedUBA: string;
    reservedUBA: string;
    redeemingUBA: string;
    poolRedeemingUBA: string;
    dustUBA: string;
    ccbStartTimestamp: string;
    liquidationStartTimestamp: string;
    maxLiquidationAmountUBA: string;
    liquidationPaymentFactorVaultBIPS: string;
    liquidationPaymentFactorPoolBIPS: string;
    underlyingBalanceUBA: string;
    requiredUnderlyingBalanceUBA: string;
    freeUnderlyingBalanceUBA: string;
    announcedUnderlyingWithdrawalId: string;
    buyFAssetByAgentFactorBIPS: string;
    poolExitCollateralRatioBIPS: string;
    poolTopupCollateralRatioBIPS: string;
    poolTopupTokenPriceFactorBIPS: string;
    poolSuffix: string;
    handshakeType: number;
    delegates: {
        address: string;
        delegation: string;
    }[];
}

export interface IIconProps {
    width?: string;
    height?: string;
    className?: string;
}

export interface IPoolBalance {
    status: string;
    data: {
        balance: string;
    }
}

export interface IFreeVaultBalance {
    status: string;
    data: {
        balance: string;
    }
}

export interface IBalance {
    symbol: string;
    balance: string;
    wrapped?: string;
}

export interface IUnderlyingAddress {
    asset: string;
    address: string;
}

export interface ICalculateCollateral {
    amount: string;
    ownerBalance: string;
    symbol: string;
}

export interface IFeeBalance {
    balance: string;
}

export interface ISelfMintBalance {
    ownerbalance: string;
    assetSymbol: string;
    lotSize: number;
    freeLots: string;
}

export interface IAmountForSelfMint {
    amountToPay: string;
    ownerBalance: string;
    assetSymbol: string;
    freeLots: string;
}

export interface ISelfMintUnderlyingBalance {
    assetSymbol: string;
    lotSize: number;
    freeUnderlyingBalance: string;
    freeLots: string;
}

export interface IAmountForSelfMintFreeUnderlying {
    amountToPay: string;
    agentFreeUnderlying: string;
    assetSymbol: string;
    freeLots: string;
}

export interface IOwnerUnderlyingBalance {
    balance: string;
    symbol: string;
}

export interface ISafeFreeUnderlyingBalance {
    balance: string;
    symbol: string;
}
