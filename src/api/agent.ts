import { useQuery, useQueryClient, useMutation, TData } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { Collateral, BotAlert } from '@/types';

const resource = 'agent';

export function useWorkAddress(enabled: boolean = true) {
    return useQuery({
        queryKey: ['workAddress'],
        queryFn: async () => {
            const response = await apiClient.get(`${resource}/workAddress`);
            return response.data.data.length > 0 ? response.data.data : null;
        },
        enabled: enabled
    });
}

export function useAgentInfo(fAssetSymbol: string) {
    return useQuery({
        queryKey: ['agentInfo'],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/info/data/${fAssetSymbol}`);
            return response.data.data;
        }
    });
}

export function useCollaterals() {
    return useQuery({
        queryKey: ['collaterals'],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/collaterals`);
            return <Collateral[]> response.data.data;
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
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/secretsExist`);
            return response.data.data;
        },
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
        mutationFn: async(secret: string): Promise<any> => {
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
            const response = await apiClient.get(`${resource}/botAlert`)<BotAlert>;
            const foo: BotAlert[] = [
                {
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                },
                {
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                },
                {
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                },
                {
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                },{
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                }
                ,{
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                }
                ,{
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                },
                {
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                },
                {
                    "bot_type": "liquidator",
                    "address": "0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0",
                    "level": "info",
                    "title": "AGENT CREATED",
                    "description": "Agent 0x7fBd0b3aB8f06A291d96EdE7B1bb5dBb84F525F0 was created."
                }
            ]

            return foo;
            return <BotAlert[]> response.data.data
        }
    });
}
