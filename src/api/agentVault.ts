import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import {
    IAmountForSelfMint,
    IAmountForSelfMintFreeUnderlying,
    ICalculateCollateral,
    ICvFee,
    IFreeVaultBalance,
    IRequestableCVData,
    ISelfMintBalance,
    ISelfMintUnderlyingBalance,
    ITransferableCVData
} from "@/types";

const resource = 'agentVault';

const AGENT_VAULT_KEY = {
    FREE_VAULT_BALANCE: 'agentVault.freeVaultBalance',
    BACKED_AMOUNT: 'agentVault.backedAmount',
    CALCULATE_COLLATERALS: 'agentVault.calculateCollaterals',
    SELF_MINT_BALANCES: 'agentVault.selfMintBalances',
    SELF_MINT_FREE_UNDERLYING_BALANCES: 'agentVault.selfMintFreeUnderlyingBalances',
    AMOUNT_FOR_SELF_MINT: 'agentVault.amountForSelfMint',
    AMOUNT_FOR_SELF_MINT_FREE_UNDERLYING: 'agentVault.amountForSelfMintFreeUnderlying',
    TRANSFERABLE_CV_DATA: 'agentVault.transferableCvData',
    REQUESTABLE_CV_DATA: 'agentVault.requestableCvData',
    CV_FEE: 'agentVault.cvFee'
}

export function useDepositCollateral() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/collateral/deposit/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    });
}

export function useCloseVault() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress }: { fAssetSymbol: string, agentVaultAddress: string }) => {
            const response = await apiClient.post(`${resource}/close/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data;
        }
    });
}

export function useFreeVaultBalance(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.FREE_VAULT_BALANCE, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/collateral/freeVaultBalance/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data as IFreeVaultBalance;
        },
        enabled: enabled
    })
}

export function useWithdrawVault() {
    return useMutation({
        mutationFn: async({ fAssetSymbol, agentVaultAddress, amount }: { fAssetSymbol: string, agentVaultAddress: string, amount: number }) => {
            const response = await apiClient.post(`${resource}/collateral/withdrawVault/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    })
}

export function useBackedAmount(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.BACKED_AMOUNT, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/backedAmount/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as string;
        },
        enabled: enabled
    })
}

export function useCalculateCollaterals(fAssetSymbol: string, agentVaultAddress: string, lots: number, multiplier: number, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.CALCULATE_COLLATERALS, fAssetSymbol, agentVaultAddress, lots, multiplier],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/calculateCollaterals/${fAssetSymbol}/${agentVaultAddress}/${lots}/${multiplier}`);
            return response.data.data as ICalculateCollateral[];
        },
        enabled: enabled
    })
}

export function useDepositCollaterals() {
    return useMutation({
        mutationFn: async({
            fAssetSymbol,
            agentVaultAddress,
            lots,
            multiplier
        }: {
            fAssetSymbol: string,
            agentVaultAddress: string,
            lots: number,
            multiplier: number
        }) => {
            const response = await apiClient.get(`${resource}/depositCollaterals/${fAssetSymbol}/${agentVaultAddress}/${lots}/${multiplier}`);
            return response.data;
        }
    })
}

export function useGetSelfMintBalances(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.SELF_MINT_BALANCES, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/getSelfMintBalances/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as ISelfMintBalance;
        },
        enabled: enabled
    })
}

export function useAmountForSelfMint(fAssetSymbol: string, agentVaultAddress: string, lots: number, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.AMOUNT_FOR_SELF_MINT, fAssetSymbol, agentVaultAddress, lots],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/amountForSelfMint/${fAssetSymbol}/${agentVaultAddress}/${lots}`);
            return response.data.data as IAmountForSelfMint;
        },
        enabled: enabled
    })
}

export function useSelfMint() {
    return useMutation({
        mutationFn: async({
              fAssetSymbol,
              agentVaultAddress,
              lots
        }: {
            fAssetSymbol: string,
            agentVaultAddress: string,
            lots: number
        }) => {
            const response = await apiClient.get(`${resource}/selfMint/${fAssetSymbol}/${agentVaultAddress}/${lots}`);
            return response.data;
        }
    })
}

export function useGetSelfMintUnderlyingBalances(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.SELF_MINT_FREE_UNDERLYING_BALANCES, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/getSelfMintFreeUnderlyingBalances/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as ISelfMintUnderlyingBalance;
        },
        enabled: enabled
    })
}

export function useAmountForSelfMintFromFreeUnderlying(fAssetSymbol: string, agentVaultAddress: string, lots: number, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.AMOUNT_FOR_SELF_MINT_FREE_UNDERLYING, fAssetSymbol, agentVaultAddress, lots],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/amountForSelfMintFromFreeUnderlying/${fAssetSymbol}/${agentVaultAddress}/${lots}`);
            return response.data.data as IAmountForSelfMintFreeUnderlying;
        },
        enabled: enabled
    })
}

export function useSelfMintFromFreeUnderlying() {
    return useMutation({
        mutationFn: async({
          fAssetSymbol,
          agentVaultAddress,
          lots
        }: {
            fAssetSymbol: string,
            agentVaultAddress: string,
            lots: number
        }) => {
            const response = await apiClient.get(`${resource}/selfMintFromFreeUnderlying/${fAssetSymbol}/${agentVaultAddress}/${lots}`);
            return response.data;
        }
    })
}

export function useTransferableCvData(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.TRANSFERABLE_CV_DATA, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/getTransferableCVData/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as ITransferableCVData;
        },
        enabled: enabled
    })
}

export function useRequestTransferToCv() {
    return useMutation({
        mutationFn: async({
              fAssetSymbol,
              agentVaultAddress,
              amount
        }: {
            fAssetSymbol: string,
            agentVaultAddress: string,
            amount: number
        }) => {
            const response = await apiClient.get(`${resource}/requestTransferToCV/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data;
        }
    })
}

export function useRequestableCvData(fAssetSymbol: string, agentVaultAddress: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.REQUESTABLE_CV_DATA, fAssetSymbol, agentVaultAddress],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/getRequestableCVData/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data.data as IRequestableCVData;
        },
        enabled: enabled
    })
}

export function useRequestWithdrawalFromCv() {
    return useMutation({
        mutationFn: async({
              fAssetSymbol,
              agentVaultAddress,
              lots
        }: {
            fAssetSymbol: string,
            agentVaultAddress: string,
            lots: number
        }) => {
            const response = await apiClient.get(`${resource}/requestWithdrawalFromCV/${fAssetSymbol}/${agentVaultAddress}/${lots}`);
            return response.data;
        }
    })
}

export function useCvFee(fAssetSymbol: string, agentVaultAddress: string, amount: number, enabled: boolean = true) {
    return useQuery({
        queryKey: [AGENT_VAULT_KEY.REQUESTABLE_CV_DATA, fAssetSymbol, agentVaultAddress, amount],
        queryFn: async() => {
            const response = await apiClient.get(`${resource}/getCVFee/${fAssetSymbol}/${agentVaultAddress}/${amount}`);
            return response.data.data as ICvFee;
        },
        enabled: enabled
    })
}

export function useCancelTransferToCoreVault() {
    return useMutation({
        mutationFn: async({
            fAssetSymbol,
            agentVaultAddress
        }: {
            fAssetSymbol: string,
            agentVaultAddress: string
        }) => {
            const response = await apiClient.post(`${resource}/cancelCVTransfer/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data;
        }
    })
}

export function useCancelReturnFromCoreVault() {
    return useMutation({
        mutationFn: async({
            fAssetSymbol,
            agentVaultAddress
        }: {
            fAssetSymbol: string,
            agentVaultAddress: string
        }) => {
            const response = await apiClient.post(`${resource}/cancelCVWithdrawal/${fAssetSymbol}/${agentVaultAddress}`);
            return response.data;
        }
    })
}
