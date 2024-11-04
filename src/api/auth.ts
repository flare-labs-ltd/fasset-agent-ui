import { useMutation } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";

const resource = 'auth';

export function useLogin() {
    return useMutation({
        mutationFn: async (password: string) => {
            const response = await apiClient.post(`${resource}/login`, { password: password });
            return response.data;
        },
    });
}
