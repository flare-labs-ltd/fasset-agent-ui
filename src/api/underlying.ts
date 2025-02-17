import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { ISafeFreeUnderlyingBalance } from "@/types";

const resource = 'underlying';

const UNDERLYING_KEY = {
    SAFE_FREE_UNDERLYING_BALANCE: 'underlying.safeFreeUnderlyingBalance'
}

export function useUnderlyingTopUp() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/underlyingTopUp/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    })
}

export function useSafeFreeUnderlyingBalance(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [UNDERLYING_KEY.SAFE_FREE_UNDERLYING_BALANCE, fAssetSymbol, agentVaultAddress],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/safeFreeUnderlyingBalance/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as ISafeFreeUnderlyingBalance;
        },
        enabled: enabled
    })
}

export function useWithdraw() {
    return useMutation({
        mutationFn: async({
            fAssetSymbol,
            agentVaultAddress,
            amount,
            destinationAddress
        }:
          {
              fAssetSymbol: string,
              agentVaultAddress: string,
              amount: number ,
              destinationAddress: string
          }) => {
            const response = await apiClient.get(`${resource}/withdraw/${fAssetSymbol}/${agentVaultAddress}/${amount}/${destinationAddress}`);
            return response.data;
        }
    })
}
