import {
    useQuery,
    useQueryClient,
    useMutation,
} from "@tanstack/react-query";
import qs from "qs";
import apiClient from "@/api/apiClient";
import {
    ICollateral,
    IBotAlerts,
    IAgentSettingsConfig,
    IAgentVault,
    IAgentSettingsDTO,
    ISecretsTemplate,
    IVault,
    INotification,
    ICollateralItem,
    IBalance,
    IUnderlyingAddress,
    IVaultCollateral,
    IOwnerUnderlyingBalance,
    IOwnerFassetBalance
} from "@/types";
import { orderBy } from "lodash";

const resource = 'agent';
const AGENT_KEY = {
    WORK_ADDRESS: 'agent.workAddress',
    COLLATERALS: 'agent.collaterals',
    SECRET_EXISTS: 'agent.secretExists',
    WHITELISTED: 'agent.whitelisted',
    BOT_ALERT: 'agent.botAlert',
    VAULTS: 'agent.vaults',
    VAULT_COLLATERALS: 'agent.vaultCollaterals',
    BOT_STATUS: 'agent.botStatus',
    VAULT_INFO: 'agent.vaultInfo',
    SECRETS_TEMPLATE: 'agent.secretsTemplate',
    UNDERLYING_ASSET_BALANCE: 'agent.getUderlyingAssetBalance',
    NOTIFICATIONS: 'agent.notifications',
    MANAGEMENT_ADDRESS: 'agent.managementAddress',
    BALANCES: 'agent.balances',
    UNDERLYING_ADDRESSES: 'agent.underlyingAddresses',
    OWNER_UNDERLYING_BALANCE: 'agent.ownerUnderlyingBalance',
    OWNER_FASSET_BALANCE: 'agent.ownerFassetBalance'
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

export function useCollaterals(enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.COLLATERALS],
        queryFn: async(): Promise<ICollateral[]> => {
            const response = await apiClient.get(`${resource}/collaterals`);
            return response.data.data;
        },
        select: (data: ICollateral[]) => {
            const collaterals: ICollateralItem[] = [];
            const symbols: string[] = [];

            data.forEach(item => {
                item.collaterals.forEach((collateral) => {
                    if (symbols.includes(collateral.symbol)) return;
                    symbols.push(collateral.symbol);
                    collaterals.push(collateral);
                });
            });

            return collaterals;
        },
        enabled: enabled
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
        queryFn: async(): Promise<IVault[]> => {
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

export function useGetUnderlyingAssetBalance(fAssetSymbol: string | null, enabled: boolean = true) {
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

export function useBotAlert(limit: number, offset: number, types: string[], enabled: boolean = true) {
    const params: { limit: number; offset: number; types?: string } = {
        limit,
        offset,
    };

    if (types.length > 0) {
        params.types = types.join(',');
    }

    const config = {
        params,
        paramsSerializer: (params: any) => {
            return qs.stringify(params);
        },
    };

    return useQuery({
        queryKey: [AGENT_KEY.BOT_ALERT, config.params.limit, config.params.offset, config.params?.types],
        queryFn: async(): Promise<IBotAlerts> => {
            const response = await apiClient.get(`${resource}/botAlert`, config);
            return response.data.data
        },
        select: (data: IBotAlerts) => {
            data.alerts = orderBy(data.alerts, 'date', 'desc')
            return data;
        },
        enabled: enabled
    });
}

export function useNotifications() {
    return useQuery({
        queryKey: [AGENT_KEY.NOTIFICATIONS],
        queryFn: async(): Promise<INotification[]> => {
            const response = await apiClient.get('https://fasset-tg-bot.flare.network/pull_flare_messages');
            return response.data.data
        },
        select: (data: INotification[]) => {
            return orderBy(data, 'time', 'desc');
        }
    });
}

export function useManagementAddress() {
    return useQuery({
        queryKey: [AGENT_KEY.MANAGEMENT_ADDRESS],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/managementAddress`);
            return response.data.data;
        }
    });
}

export function useSelfClose() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/selfClose/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        },
    })
}

export function useBalances(enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.BALANCES],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/balances`);
            return response.data.data as IBalance[];
        },
        enabled: enabled
    })
}

export function useUnderlyingAddresses() {
    return useQuery({
        queryKey: [AGENT_KEY.UNDERLYING_ADDRESSES],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/underlyingAddresses`);
            return response.data.data as IUnderlyingAddress[];
        }
    })
}

export function useOwnerUnderlyingBalance(fAssetSymbol: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.OWNER_UNDERLYING_BALANCE, fAssetSymbol],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/ownerUnderlyingBalance/${fAssetSymbol}`);
            return response.data.data as IOwnerUnderlyingBalance;
        },
        enabled: enabled
    })
}

export function useOwnerFassetBalance(fAssetSymbol: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_KEY.OWNER_FASSET_BALANCE, fAssetSymbol],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/ownerFassetBalance/${fAssetSymbol}`);
            return response.data.data as IOwnerFassetBalance;
        },
        enabled: enabled
    })
}
