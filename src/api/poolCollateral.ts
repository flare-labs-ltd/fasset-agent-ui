import {
    useMutation,
} from '@tanstack/react-query';
import apiClient from "@/api/apiClient";

const resource = 'pool';

export function useDepositFLRInPool() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number}) => {
            const response = await apiClient.post(`${resource}/collateral/buy/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    });
}
