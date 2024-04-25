import {
    Button,
    Paper,
    Text,
    Loader
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useFAssetSymbols, useAgentVaultsStatus } from '@/api/agent';
import { useEffect, useState } from 'react';
import { AgentVaultStatus } from '@/types';
import Link from 'next/link';
interface IVaultsCard {
    className?: string
}

export default function VaultsCard({ className }: IVaultsCard) {
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const { t } = useTranslation();
    const fAssetSymbols = useFAssetSymbols();
    const agentVaultsStatus = useAgentVaultsStatus(fAssetSymbols?.data);

    useEffect(() => {
        if (!agentVaultsStatus.isFetched) return;
        setIsEmpty(agentVaultsStatus.data.filter((items: AgentVaultStatus[]) => items === undefined || items.length === 0).length === agentVaultsStatus.data.length);
    }, [agentVaultsStatus]);

    return (
        <div className="flex flex-col">
            {agentVaultsStatus.isPending
                ? <Loader className="mt-5 ml-auto mr-auto" />
                : isEmpty
                    ? <div className="w-full mt-5 flex items-center justify-center">
                        <Text size="lg" color="red">{t('vault_card.empty_vaults_label')}</Text>
                    </div>
                    : <div />
            }
            {!agentVaultsStatus.isPending && !isEmpty &&
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {agentVaultsStatus?.data?.map(item => (
                        item?.vaultsStatus?.map((vault: AgentVaultStatus, index: number) => (
                            <Paper
                                className={`p-4 ${className}`}
                                withBorder
                                key={index}
                            >
                                <div className="flex flex-wrap justify-between items-center">
                                    <Text fw={700}>VAULT NAME</Text>
                                    <Button
                                        component={Link}
                                        href={`/vault/${item.fAssetSymbol}/${vault.vaultAddress}`}
                                        size="xs"
                                        variant="outline"
                                        className="ml-3"
                                    >
                                        {t('vault_card.manage_button')}
                                    </Button>
                                </div>
                                <div className="mt-5">
                                    <Text c="gray">{t('vault_card.status_label')}</Text>
                                    <Text className="border-b-2 pb-3 mb-3">????</Text>
                                    <Text c="gray">{t('vault_card.fasset_type_label')}</Text>
                                    <Text className="border-b-2 pb-3">????</Text>
                                    <Text c="gray">{t('vault_card.minted_amounts_label')}</Text>
                                    <Text className="border-b-2 pb-3">????</Text>
                                    <Text c="gray">{t('vault_card.minted_lots_label')}</Text>
                                    <Text className="border-b-2 pb-3">????</Text>
                                    <Text c="gray">{t('vault_card.free_amount_label')}</Text>
                                    <Text className="border-b-2 pb-3">????</Text>
                                    <Text c="gray">{t('vault_card.vault_amount_label')}</Text>
                                    <Text className="border-b-2 pb-3">
                                        {Number(vault.vaultCollateralRatioBIPS).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                                    </Text>
                                    <Text c="gray">{t('vault_card.pool_amount_label')}</Text>
                                    <Text className="border-b-2 pb-3">
                                        {Number(vault.poolCollateralRatioBIPS).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                                    </Text>
                                    <Text c="gray">{t('vault_card.agent_cpt_label')}</Text>
                                    <Text className="border-b-2 pb-3">????</Text>
                                    <Text c="gray">{t('vault_card.vault_cr_label')}</Text>
                                    <Text className="border-b-2 pb-3">????</Text>
                                    <Text c="gray">{t('vault_card.pool_cr_label')}</Text>
                                    <Text>????</Text>
                                </div>
                            </Paper>
                        ))
                    ))}
                </div>
            }
        </div>
    );
}
