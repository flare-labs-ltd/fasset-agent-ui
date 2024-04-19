import { ethers, BrowserProvider } from 'ethers';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { agentOwnerRegistryAbi } from '@/abi';

export function useSetWorkAddress() {
    const queryKey = 'agentOwnerRegistrySetWorkAddress';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(address: string) => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract("0x746cBEAa5F4CAB057f70e10c2001b3137Ac223B7", agentOwnerRegistryAbi, signer);
            return await contract.setWorkAddress(address);
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
