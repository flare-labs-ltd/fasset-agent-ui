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

export interface ICollateral {
    fassetSymbol: string;
    collaterals: {
        symbol: string;
        balance: string;
        wrapped?: string;
    }[]
}

export interface IBotAlert {
    date: string;
    alert: {
        bot_type: string;
        address: string;
        level: string;
        title: string;
        description: string;
    }
}

export interface IAgentVaultInformation {
    fassetSymbol: string;
    vaults: {
        address: string;
        freeLots: number;
        mintedAmount: number;
        mintedlots: number;
        poolAmount: number;
        poolCR: number;
        status: boolean;
        updating: boolean;
        vaultAmount: number;
        vaultCR: number;
        agentCPTs: number;
        collateralToken: string;
    }[]
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
}
