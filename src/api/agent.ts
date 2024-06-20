import {
    useQuery,
    useQueryClient,
    useMutation,
} from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import {
    ICollateral,
    IBotAlert,
    IAgentSettingsConfig,
    IAgentVault,
    IAgentVaultInformation,
    IAgentSettingsDTO,
    ISecretsTemplate,
    IVaultCollateral
} from "@/types";
import { orderBy } from "lodash";

const resource = 'agent';
const AGENT_KEY = {
    WORK_ADDRESS: 'agentWorkAddress',
    COLLATERALS: 'agentCollaterals',
    SECRET_EXISTS: 'agentSecretExists',
    WHITELISTED: 'agentWhitelisted',
    BOT_ALERT: 'agentBotAlert',
    VAULTS: 'agentVaults',
    VAULT_COLLATERALS: 'agentVaultCollaterals',
    BOT_STATUS: 'agentBotStatus',
    VAULT_INFO: 'agentVaultInfo',
    SECRETS_TEMPLATE: 'agentSecretsTemplate',
    UNDERLYING_ASSET_BALANCE: 'agentGetUderlyingAssetBalance',
    NOTIFICATIONS: 'notifications'
}

export function useWorkAddress(enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.WORK_ADDRESS],
        queryFn: async(): Promise<string> => {
            const response = await apiClient.get(`${resource}/workAddress`);
            return response.data.data;
        },
        enabled: enabled
    });
}

export function useGenerateWorkAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async() => {
            const response = await apiClient.get(`${resource}/generateWorkAddress`);
            return response.data;
        },
        onMutate: async() => {
            await queryClient.cancelQueries({ queryKey: [AGENT_KEY.WORK_ADDRESS] });
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.WORK_ADDRESS] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.WORK_ADDRESS] });
        }
    });
}

export function useSaveWorkAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ publicAddress, privateKey }: { publicAddress: string, privateKey: string }): Promise<any> => {
            const response = await apiClient.post(`${resource}/workAddress/${publicAddress}/${privateKey}`);
            return response.data;
        },
        onMutate: async() => {
            await queryClient.cancelQueries({ queryKey: [AGENT_KEY.WORK_ADDRESS] });
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.WORK_ADDRESS] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.WORK_ADDRESS] });
        }
    });
}

export function useCollaterals() {
    return useQuery({
        queryKey: [AGENT_KEY.COLLATERALS],
        queryFn: async(): Promise<ICollateral[]> => {
            const response = await apiClient.get(`${resource}/collaterals`);
            return response.data.data;
        },
        select: (data: ICollateral[]) => {
            const collaterals: {
                symbol: string;
                balance: string;
                wrapped?: string;
            }[] = [];
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

export function useVaultCollaterals() {
    return useQuery({
        queryKey: [AGENT_KEY.VAULT_COLLATERALS],
        queryFn: async(): Promise<IVaultCollateral[]> => {
            const response = await apiClient.get(`${resource}/vaultCollaterals`);
            return response.data.data;
        }
    });
}

export function useSecretExists(enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.SECRET_EXISTS],
        queryFn: async(): Promise<boolean> => {
            const response = await apiClient.get(`${resource}/secretsExist`);
            return response.data.data;
        },
        enabled: enabled
    });
}

export function useUploadSecret() {
    return useMutation({
        mutationFn: async(secret: ISecretsTemplate) => {
            const response = await apiClient.post(`${resource}/secrets`, secret);
            return response.data;
        },
    });
}

export function useSecretsTemplate() {
    return useQuery({
        queryKey: [AGENT_KEY.SECRETS_TEMPLATE],
        queryFn: async(): Promise<ISecretsTemplate> => {
            const response = await apiClient.get(`${resource}/secretsTemplate`);
            return response.data.data;
        }
    });
}

export function useActivateVault() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress }: { fAssetSymbol: string, agentVaultAddress: string }) => {
            const response = await apiClient.post(`${resource}/available/enter/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data
        }
    });
}

export function useDeactivateVault() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress }: { fAssetSymbol: string, agentVaultAddress: string }) => {
            const response = await apiClient.post(`${resource}/available/exit/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data;
        }
    });
}

export function useAgentVaultsInformation() {
    return useQuery({
        queryKey: [AGENT_KEY.VAULTS],
        queryFn: async(): Promise<IAgentVaultInformation[]> => {
            const response = await apiClient.get(`${resource}/vaults`);
            return response.data.data;
        }
    });
}

export function useCreateVault() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ fAssetSymbol, payload }: { fAssetSymbol: string, payload: IAgentSettingsConfig }) => {
            const response = await apiClient.post(`${resource}/create/${fAssetSymbol}`, payload);
            return response.data;
        },
        onMutate: async() => {
            await queryClient.cancelQueries({ queryKey: [AGENT_KEY.VAULTS] });
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.VAULTS] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.VAULTS] });
        }
    });
}

export function useBotStatus() {
    return useQuery({
        queryKey: [AGENT_KEY.BOT_STATUS],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/botStatus`);
            return response.data.data
        }
    });
}

export function useVaultInfo(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.VAULT_INFO, fAssetSymbol, agentVaultAddress],
        queryFn: async(): Promise<IAgentVault> => {
            const response = await apiClient.get(`${resource}/info/vault/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data;
        },
        enabled: enabled
    });
}

export function useUpdateVault() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, payload }: { fAssetSymbol: string, agentVaultAddress: string, payload: IAgentSettingsDTO[] }) => {
            const response = await apiClient.post(`${resource}/settings/update/${fAssetSymbol}/${agentVaultAddress}`, payload);
            return response.data;
        },
        onMutate: async() => {
            await queryClient.cancelQueries({ queryKey: [AGENT_KEY.VAULTS] });
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.VAULTS] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [AGENT_KEY.VAULTS] });
        }
    });
}

export function useGetUnderlyingAssetBalance(fAssetSymbol: string|null, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.UNDERLYING_ASSET_BALANCE, fAssetSymbol],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/info/underlying/balance/${fAssetSymbol}`);
            return response.data.data
        },
        enabled: enabled
    });
}

export function useIsWhitelisted(enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.WHITELISTED],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/whitelisted`);
            return response.data.data === undefined ? false : response.data.data;
        },
        enabled: enabled
    });
}

export function useBotAlert() {
    return useQuery({
        queryKey: [AGENT_KEY.BOT_ALERT],
        queryFn: async(): Promise<IBotAlert[]> => {
            const response = await apiClient.get(`${resource}/botAlert`);
            return response.data.data
        },
        select: (data: IBotAlert[]) => {
            return orderBy(data, 'date', 'desc');
        }
    });
}

export function useNotifications() {
    return useQuery({
        queryKey: [AGENT_KEY.NOTIFICATIONS],
        queryFn: async(): Promise<IBotAlert[]> => {
            //TODO: REPLACE WITH NOTIFICATIONS REQUEST
            const response = await apiClient.get(`${resource}/botAlert`);
            return response.data.data
        }
    });
}
