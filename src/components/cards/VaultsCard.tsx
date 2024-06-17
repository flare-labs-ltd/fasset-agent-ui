import {
    Button,
    Paper,
    Text,
    Loader
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconChecklist, IconUrgent } from '@tabler/icons-react';
import { useAgentVaultsInformation } from '@/api/agent';
import Link from 'next/link';
import classes from '@/styles/components/cards/VaultsCard.module.scss';
import { useEffect } from 'react';

interface IVaultsCard {
    className?: string
}

const VAULTS_REFETCH_INTERVAL = 60000;

export default function VaultsCard({ className }: IVaultsCard) {
    const { t } = useTranslation();
    const agentVaultsInformation = useAgentVaultsInformation();

    useEffect(() => {
        const agentVaultsInformationFetchInterval = setInterval(() => {
            agentVaultsInformation.refetch();
        }, VAULTS_REFETCH_INTERVAL);

        return () => clearInterval(agentVaultsInformationFetchInterval);
    }, []);

    return (
        <div className="flex flex-col">
            {agentVaultsInformation.isPending &&
                <Loader className="mt-5 ml-auto mr-auto" />
            }
            {!agentVaultsInformation.isPending && agentVaultsInformation?.data?.length == 0 &&
                <div className="w-full mt-5 flex items-center justify-center">
                    <Text size="lg" color="red">{t('vault_card.empty_vaults_label')}</Text>
                </div>
            }
            {!agentVaultsInformation.isPending && agentVaultsInformation?.data && agentVaultsInformation?.data?.length > 0 &&
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {agentVaultsInformation?.data?.map(agentVaultInformation => (
                        agentVaultInformation.vaults.map((vault, index) => (
                            <Paper
                                className={`p-4 ${className}`}
                                withBorder
                                key={index}
                            >
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className="flex justify-between">
                                        <Text
                                            fw={700}
                                            className={classes.vaultAddress}
                                        >
                                            {vault.address}
                                        </Text>
                                        <Button
                                            component={Link}
                                            href={`/vault/${agentVaultInformation.fassetSymbol}/${vault.address}`}
                                            size="xs"
                                            variant="gradient"
                                            className="ml-3 shrink-0"
                                        >
                                            {t('vault_card.manage_button')}
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div
                                        className="border-b-2 pb-3 mb-3 p-2"
                                        style={{ backgroundColor: vault.updating ? '#4983DA1A' : '#13821E1A' }}
                                    >
                                        <Text c="gray">{t('vault_card.status_label')}</Text>
                                        <Text
                                            c={vault.updating ? 'blue' : 'green'}
                                            className="flex items-center"
                                        >
                                            {vault.updating
                                                ? t('vault_card.updating_label')
                                                : vault.status ? t('vault_card.public_live_label') : t('vault_card.not_listed_label')
                                            }
                                            {vault.updating
                                                ? <IconUrgent
                                                    size={24}
                                                    color="var(--mantine-color-blue-text)"
                                                    className="ml-auto self-baseline"
                                                />
                                                : <IconChecklist
                                                    size={24}
                                                    color="var(--mantine-color-green-text)"
                                                    className="ml-auto self-baseline"
                                                />
                                            }
                                        </Text>
                                    </div>
                                    <Text c="gray" className="px-2">{t('vault_card.fasset_type_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{agentVaultInformation.fassetSymbol}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.minted_amounts_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{vault.mintedAmount}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.minted_lots_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{vault.mintedlots}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.free_amount_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{vault.freeLots}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.vault_amount_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{vault.vaultAmount}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.pool_amount_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{vault.poolAmount}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.agent_cpt_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{vault.agentCPTs}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.vault_cr_label')}</Text>
                                    <Text className="border-b-2 px-2 pb-3">{vault.vaultCR}</Text>
                                    <Text c="gray" className="px-2">{t('vault_card.pool_cr_label')}</Text>
                                    <Text className="px-2">{vault.poolCR}</Text>
                                </div>
                            </Paper>
                        ))
                    ))}
                </div>
            }
        </div>
    );
}
