import {
    Table,
    Paper,
    Loader,
    rem,
    Badge,
    Menu,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
    IconCopy,
    IconDots,
    IconBook2,
    IconBookUpload,
    IconDashboard,
    IconDashboardOff
} from '@tabler/icons-react';
import { useAgentVaultsInformation } from '@/api/agent';
import { useEffect, useState } from 'react';
import { truncateString, copyToClipboard } from "@/utils";
import Link from "next/link";
import DepositCollateralModal from "@/components/modals/DepositCollateralModal";
import DepositFLRModal from "@/components/modals/DepositFLRModal";
import ActivateVaultModal from "@/components/modals/ActivateVaultModal";
import DeactivateVaultModal from "@/components/modals/DeactivateVaultModal";
import classes from "@/styles/components/cards/VaultsCard.module.scss";

interface IVaultsCard {
    className?: string
}

const VAULTS_REFETCH_INTERVAL = 60000;

export default function VaultsCard({ className }: IVaultsCard) {
    const [selectedAgentVault, setSelectedAgentVault] = useState<any>();
    const [isDepositCollateralModalActive, setIsDepositCollateralModalActive] = useState<boolean>(false);
    const [isDepositFLRModalActive, setIsDepositFLRModalActive] = useState<boolean>(false);
    const [isActivateVaultModalActive, setIsActivateVaultModalActive] = useState<boolean>(false);
    const [isDeactivateVaultModalActive, setIsDeactivateVaultModalActive] = useState<boolean>(false);

    const { t } = useTranslation();
    const agentVaultsInformation = useAgentVaultsInformation();

    useEffect(() => {
        const agentVaultsInformationFetchInterval = setInterval(() => {
            agentVaultsInformation.refetch();
        }, VAULTS_REFETCH_INTERVAL);

        return () => clearInterval(agentVaultsInformationFetchInterval);
    }, []);

    const onDepositCollateralClick = (vault: any) => {
        setIsDepositCollateralModalActive(true);
        setSelectedAgentVault(vault);
    }

    return (
        <Paper
            className={`p-4 ${className}`}
            withBorder
        >
            <Table.ScrollContainer minWidth={900}>
                <Table
                    withTableBorder
                    verticalSpacing="md"
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className="uppercase">{t('vaults_card.table.vault_address_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.agent_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.status_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.type_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.minted_amounts_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.minted_lots_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.free_lots_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.vault_amount_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.pool_amount_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.vault_cr_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('vaults_card.table.pool_cr_label')}</Table.Th>
                            <Table.Th
                                className={`uppercase text-right ${agentVaultsInformation.data?.length !== 0 ? classes.sticky : ''}`}
                            >
                                {t('vaults_card.table.actions_label')}
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {agentVaultsInformation.isPending &&
                            <Table.Tr>
                                <Table.Td
                                    colSpan={12}
                                >
                                    <Loader className="flex mx-auto mt-2" />
                                </Table.Td>
                            </Table.Tr>
                        }
                        {agentVaultsInformation.data?.length === 0 && !agentVaultsInformation.isPending &&
                            <Table.Tr>
                                <Table.Td colSpan={12} className="text-center">
                                    {t('vaults_card.empty_vaults_label')}
                                </Table.Td>
                            </Table.Tr>
                        }
                        {agentVaultsInformation.data !== undefined &&
                            agentVaultsInformation.data.map(agentVaultInformation => (
                                agentVaultInformation.vaults.map(vault => (
                                    <Table.Tr key={vault.address}>
                                        <Table.Td>
                                            <div className="flex items-center">
                                                {truncateString(vault.address, 5, 5)}
                                                <IconCopy
                                                    color="black"
                                                    style={{ width: rem(15), height: rem(15) }}
                                                    onClick={() => copyToClipboard(vault.address)}
                                                    className="ml-2 cursor-pointer"
                                                />
                                            </div>
                                        </Table.Td>
                                        <Table.Td>1</Table.Td>
                                        <Table.Td>
                                            <Badge
                                                variant="filled"
                                                color="rgba(36, 36, 37, 0.06)"
                                                radius="xs"
                                                className="uppercase font-normal text-black"
                                            >
                                                {vault.updating
                                                    ? t('vaults_card.updating_label')
                                                    : (vault.status ? t('vaults_card.public_live_label') : t('vaults_card.not_listed_label'))
                                                }
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>{agentVaultInformation.fassetSymbol}</Table.Td>
                                        <Table.Td>{vault.mintedAmount} {agentVaultInformation.fassetSymbol}</Table.Td>
                                        <Table.Td>{vault.mintedlots}</Table.Td>
                                        <Table.Td>{vault.freeLots}</Table.Td>
                                        <Table.Td>{vault.vaultAmount}</Table.Td>
                                        <Table.Td>{vault.poolAmount}</Table.Td>
                                        <Table.Td>{vault.vaultCR}</Table.Td>
                                        <Table.Td>{vault.poolCR}</Table.Td>
                                        <Table.Td className={agentVaultsInformation.data?.length !== 0 ? classes.sticky : ''}>
                                            <Menu>
                                                <Menu.Target>
                                                    <IconDots
                                                        style={{ width: rem(20), height: rem(20) }}
                                                        className="cursor-pointer ml-auto"
                                                    />
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Label>{t('vaults_card.table.actions_menu.vault_actions_title')}</Menu.Label>
                                                    <Menu.Item
                                                        leftSection={<IconBook2 style={{ width: rem(14), height: rem(14) }} />}
                                                    >
                                                        <Link
                                                            href={`/vault/${agentVaultInformation.fassetSymbol}/${vault.address}`}
                                                        >
                                                            {t('vaults_card.table.actions_menu.view_vault_label')}
                                                        </Link>
                                                    </Menu.Item>
                                                    <Menu.Divider />
                                                    <Menu.Label>{t('vaults_card.table.actions_menu.agent_vault_operations_title')}</Menu.Label>
                                                    <Menu.Item
                                                        leftSection={<IconBookUpload style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => onDepositCollateralClick(vault)}
                                                    >
                                                        {t('vaults_card.table.actions_menu.deposit_collateral_label')}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconBookUpload style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => setIsDepositFLRModalActive(true)}
                                                    >
                                                        {t('vaults_card.table.actions_menu.deposit_flr_in_pool_label')}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconDashboard style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => setIsActivateVaultModalActive(true)}
                                                        disabled={vault.status}
                                                    >
                                                        {t('vaults_card.table.actions_menu.activate_vault_label')}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconDashboardOff style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => setIsActivateVaultModalActive(true)}
                                                        c="var(--mantine-color-red-9)"
                                                        bg="rgba(248, 233, 233, 1)"

                                                    >
                                                        {t('vaults_card.table.actions_menu.close_vault_label')}
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            ))
                        }
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            {selectedAgentVault &&
                <DepositCollateralModal
                    vaultCollateralToken={selectedAgentVault.collateralToken}
                    opened={isDepositCollateralModalActive}
                    onClose={() => setIsDepositCollateralModalActive(false)}
                />
            }
            <DepositFLRModal
                opened={isDepositFLRModalActive}
                onClose={() => setIsDepositFLRModalActive(false)}
            />
            <ActivateVaultModal
                opened={isActivateVaultModalActive}
                onClose={() => setIsActivateVaultModalActive(false)}
            />
            <DeactivateVaultModal
                opened={isDeactivateVaultModalActive}
                onClose={() => setIsDeactivateVaultModalActive(false)}
            />
        </Paper>
    );
}
