import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from "@/api/apiClient";
import { IFeeBalance, IPoolBalance } from "@/types";

const resource = 'pool';

const POOL_COLLATERAL_KEY = {
    POOL_BALANCE: 'poolCollateral.poolBalance',
    POOL_FEE_BALANCE: 'poolCollateral.poolFeeBalance'
}

export function useDepositFLRInPool() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/collateral/buy/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    });
}

export function usePoolBalance(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [POOL_COLLATERAL_KEY.POOL_BALANCE, fAssetSymbol, agentVaultAddress],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/collateral/poolBalance/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data as IPoolBalance;
        },
        enabled: enabled
    })
}

export function useWithdrawPool() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/collateral/withdrawPool/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    });
}

export function useFeeBalance(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [POOL_COLLATERAL_KEY.POOL_FEE_BALANCE, fAssetSymbol, agentVaultAddress],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/fee/balance/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as IFeeBalance;
        },
        enabled: enabled
    })
}

export function useFeeWithdraw() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/fee/withdraw/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    });
}
