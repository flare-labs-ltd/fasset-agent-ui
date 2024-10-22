import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { IFreeVaultBalance } from "@/types";

const resource = 'agentVault';

const AGENT_VAULT_KEY = {
    FREE_VAULT_BALANCE: 'freeVaultBalance',
    BACKED_AMOUNT: 'backedAmount'
}

export function useDepositCollateral() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/collateral/deposit/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    });
}

export function useCloseVault() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress }: { fAssetSymbol: string, agentVaultAddress: string }) => {
            const response = await apiClient.post(`${resource}/backedAmount/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data;
        }
    });
}

export function useFreeVaultBalance(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.FREE_VAULT_BALANCE, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/collateral/freeVaultBalance/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as IFreeVaultBalance;
        },
        enabled: enabled
    })
}

export function useWithdrawVault() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/collateral/withdrawVault/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    })
}

export function useBackedAmount(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.BACKED_AMOUNT, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/collateral/freeVaultBalance/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as IFreeVaultBalance;
        },
        enabled: enabled
    })
}
