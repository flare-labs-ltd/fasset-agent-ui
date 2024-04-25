import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import apiClient from '@/api/apiClient';

const resource = 'agentVault';

export function useDepositCollateral() {
    const queryKey = 'depositCollateral';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number}) => {
            const response = await apiClient.post(`${resource}/collateral/deposit/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        },
        onMutate: async() => {
            await queryClient.cancelQueries({ queryKey: queryKey });
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        }
    });
}
