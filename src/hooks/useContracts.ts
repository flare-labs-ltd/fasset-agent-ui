import { ethers } from 'ethers';
import { useMutation } from '@tanstack/react-query';
import { agentOwnerRegistryAbi } from '@/abi';

export function useSetWorkAddress() {
    return useMutation({
        mutationFn: async(address: string) => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract("0x746cBEAa5F4CAB057f70e10c2001b3137Ac223B7", agentOwnerRegistryAbi, signer);
            return await contract.setWorkAddress(address);
        },
    });
}
