export interface Collateral {
    symbol: string,
    balance: string,
    wrapped?: string
}

export interface BotAlert {
    bot_type: string,
    address: string,
    level: string,
    title: string,
    description: string
}

export interface AgentVaultStatus {
    vaultAddress: string;
    poolCollateralRatioBIPS: string;
    vaultCollateralRatioBIPS: string;
    agentSettingUpdateValidAtFeeBIPS: string;
    agentSettingUpdateValidAtPoolFeeShareBIPS: string;
    agentSettingUpdateValidAtMintingVaultCrBIPS: string;
    agentSettingUpdateValidAtMintingPoolCrBIPS: string;
    agentSettingUpdateValidAtBuyFAssetByAgentFactorBIPS: string;
    agentSettingUpdateValidAtPoolExitCrBIPS: string;
    agentSettingUpdateValidAtPoolTopupCrBIPS: string;
    agentSettingUpdateValidAtPoolTopupTokenPriceFactorBIPS: string;
}

export interface AgentSettingsConfig {
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

export interface AgentVault {
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
}
