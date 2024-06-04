import { ethers } from 'ethers';
import { useMutation } from '@tanstack/react-query';
import { agentOwnerRegistryAbi } from '@/abi';

export function useSetWorkAddress() {
    return useMutation({
        mutationFn: async(address: string) => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract("0xDb6c11b8D074D4488f5fFd0129AA5F91C4f00fb6", agentOwnerRegistryAbi, signer);
            return await contract.setWorkAddress(address);
        },
    });
}
