import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from "@/api/apiClient";

const resource = 'agent';

export function useWorkAddress() {
    return useQuery({
        queryKey: ['workAddress'],
        queryFn: async(): Promise<any> => {
            const response = await apiClient.get(`${resource}/workAddress`);
            return response.data.data;
        }
    });
}

export function useIsWhitelisted() {
    return useQuery({
        queryKey: ['whitelisted'],
        queryFn: async(): Promise<any> => {
            const response = await apiClient.get(`${resource}/whitelisted`);
            return response.data.data;
        },
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
