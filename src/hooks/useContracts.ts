import { ethers } from "ethers";
import { useMutation } from "@tanstack/react-query";
import { agentOwnerRegistryAbi } from "@/abi";
import { useWeb3 } from "@/hooks/useWeb3";

export function useSetWorkAddress() {
    const { provider } = useWeb3();

    return useMutation({
        mutationFn: async(address: string) => {
            if (!provider) return;

            const signer = await provider.getSigner();
            // @ts-ignore
            const contract = new ethers.Contract("0xDb6c11b8D074D4488f5fFd0129AA5F91C4f00fb6", agentOwnerRegistryAbi, signer);
            return await contract.setWorkAddress(address);
        },
    });
}
