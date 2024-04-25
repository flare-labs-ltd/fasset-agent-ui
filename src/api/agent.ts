import {
    useQuery,
    useQueries,
    useQueryClient,
    useMutation,
    TData
} from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { Collateral, BotAlert, AgentSettingsConfig, AgentVault } from '@/types';

const resource = 'agent';

export function useWorkAddress(enabled: boolean = true) {
    return useQuery({
        queryKey: ['workAddress'],
        queryFn: async(): Promise<string> => {
            const response = await apiClient.get(`${resource}/workAddress`);
            return response.data.data.length > 0 ? response.data.data : null;
        },
        enabled: enabled
    });
}

export function useCollaterals() {
    return useQuery({
        queryKey: ['collaterals'],
        queryFn: async(): Promise<Collateral[]> => {
            const response = await apiClient.get(`${resource}/collaterals`);
            return response.data.data;
        },
        select: (data: TData) => {
            const collaterals: Collateral[] = [];
            const symbols: string[] = [];

            data.forEach(item => {
                item.collaterals.forEach((collateral) => {
                    if (symbols.includes(collateral.symbol)) return;
                    symbols.push(collateral.symbol);
                    collaterals.push(collateral);
                });
            });

            return collaterals;
        }
    });
}

export function useGenerateWorkAddress() {
    const queryKey = 'generateWorkAddress';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async() => {
            const response = await apiClient.get(`${resource}/generateWorkAddress`);
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

export function useSaveWorkAddress() {
    const queryKey = 'saveWorkAddress';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ publicAddress, privateKey }: { publicAddress: string, privateKey: string }): Promise<any> => {
            const response = await apiClient.post(`${resource}/workAddress/${publicAddress}/${privateKey}`);
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

export function useSecretExists() {
    return useQuery({
        queryKey: ['secretExists'],
        queryFn: async(): Promise<boolean> => {
            const response = await apiClient.get(`${resource}/secretsExist`);
            return response.data.data;
        }
    });
}

export function useIsWhitelisted(enabled: boolean = true) {
    return useQuery({
        queryKey: ['whitelisted'],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/whitelisted`);
            return response.data.data === undefined ? false : response.data.data;
        },
        enabled: enabled
    });
}

export function useUploadSecret() {
    const queryKey = 'secrets';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(secret: string) => {
            const response = await apiClient.post(`${resource}/secrets`, secret);
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

export function useBotAlert() {
    return useQuery({
        queryKey: ['botAlert'],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/botAlert`);
            return <BotAlert[]> response.data.data
        }
    });
}

export function useFAssetSymbols() {
    return useQuery({
        queryKey: ['fAssetSymbols'],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/fassetSymbols`);
            return response.data.data
        }
    });
}

export function useAgentVaultsStatus(fAssetSymbols: string[]) {
    return useQueries({
        queries: fAssetSymbols
            ? fAssetSymbols.map(fAssetSymbol => {
                return {
                    queryKey: ['vaults', fAssetSymbol],
                    queryFn: async() => {
                        const response = await apiClient.get(`${resource}/info/vaults/${fAssetSymbol}`);
                        return response.data.data === undefined ? [] : response.data.data;
                    },
                    select: (data: TData) => {
                        return {
                            vaultsStatus: data,
                            fAssetSymbol: fAssetSymbol
                        }
                    }
                }
            })
            : [],
        combine: (results) => {
            return {
                data: results.map((result) => result.data),
                isFetching: results.some((result) => result.isFetching),
                isFetched: results.some((result) => result.isFetched),
                isPending: results.some((result) => result.isPending),
            }
        }
    });
}

export function useVaultCollaterals() {
    return useQuery({
        queryKey: ['vaultCollaterals'],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/vaultCollaterals`);
            return response.data.data
        }
    });
}

export function useCreateVault() {
    const queryKey = 'createVault';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ fAssetSymbol, payload }: { fAssetSymbol: string, payload: AgentSettingsConfig }) => {
            const response = await apiClient.post(`${resource}/create/${fAssetSymbol}`, payload);
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

export function useBotStatus() {
    return useQuery({
        queryKey: ['botStatus'],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/botStatus`);
            return response.data.data
        }
    });
}

export function useVaultInfo(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['vaultInfo', fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/info/vault/${fAssetSymbol}/${agentVaultAddress}`);
            return <AgentVault[]>response.data.data
        },
        enabled: enabled
    });
}
