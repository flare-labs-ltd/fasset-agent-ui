import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from "@/api/apiClient";

const resource = 'agent';

export function useWorkAddress(enabled: boolean = true) {
    return useQuery({
        queryKey: ['workAddress'],
        queryFn: async(): Promise<any> => {
            const response = await apiClient.get(`${resource}/workAddress`);
            return response.data.data.length > 0 ? response.data.data : null;
        },
        enabled: enabled
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
