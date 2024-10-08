import {
    useMutation,
} from '@tanstack/react-query';
import apiClient from '@/api/apiClient';

const resource = 'agentVault';

export function useDepositCollateral() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number}) => {
            const response = await apiClient.post(`${resource}/collateral/deposit/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    });
}
