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
    IconDots,
    IconBook2,
    IconBookUpload,
    IconDashboard,
    IconDashboardOff
} from '@tabler/icons-react';
import { useAgentVaultsInformation } from '@/api/agent';
import { useEffect, useState } from 'react';
import { truncateString } from "@/utils";
import Link from "next/link";
import DepositCollateralModal from "@/components/modals/DepositCollateralModal";
import DepositFLRModal from "@/components/modals/DepositFLRModal";
import ActivateVaultModal from "@/components/modals/ActivateVaultModal";
import DeactivateVaultModal from "@/components/modals/DeactivateVaultModal";
import CopyIcon from "@/components/icons/CopyIcon";
import classes from "@/styles/components/cards/VaultsCard.module.scss";

interface IVaultsCard {
    className?: string
}

const VAULTS_REFETCH_INTERVAL = 60000;

const MODAL_DEPOSIT_COLLATERAL = 'deposit_collateral';
const MODAL_DEPOSIT_FLR = 'deposit_flr';
const MODAL_ACTIVATE_VAULT = 'activate_vault';
const MODAL_DEACTIVATE_VAULT = 'deactivate_vault';

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

    const onClick = (modal: string, vault: any) => {
        if (modal === MODAL_DEPOSIT_COLLATERAL) {
            setIsDepositCollateralModalActive(true);
        } else if (modal === MODAL_DEPOSIT_FLR) {
            setIsDepositFLRModalActive(true);
        } else if (modal === MODAL_ACTIVATE_VAULT) {
            setIsActivateVaultModalActive(true);
        } else if(modal === MODAL_DEACTIVATE_VAULT) {
            setIsDeactivateVaultModalActive(true);
        }

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
                            <Table.Th className="uppercase">{t('vaults_card.table.health_label')}</Table.Th>
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
                                    colSpan={13}
                                >
                                    <Loader className="flex mx-auto mt-2" />
                                </Table.Td>
                            </Table.Tr>
                        }
                        {agentVaultsInformation.data?.length === 0 && !agentVaultsInformation.isPending &&
                            <Table.Tr>
                                <Table.Td colSpan={13} className="text-center">
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
                                                <CopyIcon
                                                    text={vault.address}
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
                                        <Table.Td>{vault.health}</Table.Td>
                                        <Table.Td>{agentVaultInformation.fassetSymbol}</Table.Td>
                                        <Table.Td>{vault.mintedAmount} {agentVaultInformation.fassetSymbol}</Table.Td>
                                        <Table.Td>{vault.mintedlots}</Table.Td>
                                        <Table.Td>{vault.freeLots}</Table.Td>
                                        <Table.Td>{vault.vaultAmount} {vault.collateralToken}</Table.Td>
                                        <Table.Td>{vault.poolAmount} {t('vaults_card.table.flr_label')}</Table.Td>
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
                                                        onClick={() => onClick(MODAL_DEPOSIT_COLLATERAL, {...vault, fassetSymbol: agentVaultInformation.fassetSymbol })}
                                                    >
                                                        {t('vaults_card.table.actions_menu.deposit_collateral_label')}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconBookUpload style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => onClick(MODAL_DEPOSIT_FLR, {...vault, fassetSymbol: agentVaultInformation.fassetSymbol })}
                                                    >
                                                        {t('vaults_card.table.actions_menu.deposit_flr_in_pool_label')}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconDashboard style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => onClick(MODAL_ACTIVATE_VAULT, {...vault, fassetSymbol: agentVaultInformation.fassetSymbol })}
                                                        disabled={vault.status}
                                                    >
                                                        {t('vaults_card.table.actions_menu.activate_vault_label')}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconDashboardOff style={{ width: rem(14), height: rem(14) }} />}
                                                        onClick={() => onClick(MODAL_DEACTIVATE_VAULT, {...vault, fassetSymbol: agentVaultInformation.fassetSymbol })}
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
                <>
                    <DepositCollateralModal
                        vaultCollateralToken={selectedAgentVault.collateralToken}
                        fAssetSymbol={selectedAgentVault.fassetSymbol}
                        agentVaultAddress={selectedAgentVault.address}
                        opened={isDepositCollateralModalActive}
                        onClose={() => setIsDepositCollateralModalActive(false)}
                    />
                    <DepositFLRModal
                        opened={isDepositFLRModalActive}
                        fAssetSymbol={selectedAgentVault.fassetSymbol}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsDepositFLRModalActive(false)}
                    />
                    <ActivateVaultModal
                        opened={isActivateVaultModalActive}
                        fAssetSymbol={selectedAgentVault.fassetSymbol}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsActivateVaultModalActive(false)}
                    />
                    <DeactivateVaultModal
                        opened={isDeactivateVaultModalActive}
                        fAssetSymbol={selectedAgentVault.fassetSymbol}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsDeactivateVaultModalActive(false)}
                    />
                </>
            }
        </Paper>
    );
}
