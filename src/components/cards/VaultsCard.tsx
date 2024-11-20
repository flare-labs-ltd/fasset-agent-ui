import { useEffect, useState } from "react";
import {
    Table,
    Paper,
    rem,
    Badge,
    Menu,
    Text,
    Grid
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconDots,
    IconBook2,
    IconBookUpload,
    IconBookDownload,
    IconDashboard,
    IconDashboardOff
} from '@tabler/icons-react';
import { UseQueryResult } from "@tanstack/react-query";
import Link from "next/link";
import { useAgentVaultsInformation } from "@/api/agent";
import { isMaxCRValue, toNumber, truncateString } from "@/utils";
import DepositVaultCollateralModal from "@/components/modals/DepositVaultCollateralModal";
import DepositCollateralLotsModal from "@/components/modals/DepositCollateralLotsModal";
import DepositPoolCollateralModal from "@/components/modals/DepositPoolCollateralModal";
import ActivateVaultModal from "@/components/modals/ActivateVaultModal";
import DeactivateVaultModal from "@/components/modals/DeactivateVaultModal";
import CloseVaultModal from "@/components/modals/CloseVaultModal";
import WithdrawCollateralPoolTokensModal from "@/components/modals/WithdrawCollateralPoolTokensModal";
import WithdrawVaultCollateralModal from "@/components/modals/WithdrawVaultCollateralModal";
import SelfCloseModal from "@/components/modals/SelfCloseModal";
import CopyIcon from "@/components/icons/CopyIcon";
import { ICollateralItem, IVault } from "@/types";
import FAssetTable, { IFAssetColumn } from "@/components/elements/FAssetTable";
import CurrencyIcon from "@/components/elements/CurrencyIcon";
import { useBalances } from "@/api/agent";
import classes from "@/styles/components/cards/VaultsCard.module.scss";

interface IVaultsCard {
    className?: string,
    collateral: UseQueryResult<ICollateralItem[], Error>;
}

const VAULTS_REFETCH_INTERVAL = 60000;

const MODAL_DEPOSIT_COLLATERAL_LOTS = 'deposit_collateral_lots';
const MODAL_DEPOSIT_VAULT_COLLATERAL = 'deposit_vault_collateral';
const MODAL_DEPOSIT_POOL_COLLATERAL = 'deposit_pool_collateral';
const MODAL_ACTIVATE_VAULT = 'activate_vault';
const MODAL_DEACTIVATE_VAULT = 'deactivate_vault';
const MODAL_CLOSE_VAULT = 'close_vault';
const MODAL_WITHDRAW_COLLATERAL_POOL_TOKENS = 'withdraw_cr_tokens';
const MODAL_WITHDRAW_VAULT_COLLATERAL = 'withdraw_vault_collateral';
const MODAL_SELF_CLOSE = 'self_close';

export default function VaultsCard({ className, collateral }: IVaultsCard) {
    const [selectedAgentVault, setSelectedAgentVault] = useState<IVault>();
    const [isDepositVaultCollateralModalActive, setIsDepositVaultCollateralModalActive] = useState<boolean>(false);
    const [isDepositPoolCollateralModalActive, setIsDepositPoolCollateralModalActive] = useState<boolean>(false);
    const [isActivateVaultModalActive, setIsActivateVaultModalActive] = useState<boolean>(false);
    const [isDeactivateVaultModalActive, setIsDeactivateVaultModalActive] = useState<boolean>(false);
    const [isCloseVaultModalActive, setIsCloseVaultModalActive] = useState<boolean>(false);
    const [isWithdrawCollateralPoolTokensModalActive, setIsWithdrawCollateralPoolTokensModalActive] = useState<boolean>(false);
    const [isWithdrawCollateralModalActive, setIsWithdrawCollateralModalActive] = useState<boolean>(false);
    const [isSelfCloseModalActive, setIsSelfCloseModalActive] = useState<boolean>(false);
    const [isDepositCollateralLotsModalActive, setIsDepositCollateralLotsModalActive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { t } = useTranslation();
    const agentVaultsInformation = useAgentVaultsInformation();
    const balances = useBalances(false);

    useEffect(() => {
        const agentVaultsInformationFetchInterval = setInterval(() => {
            agentVaultsInformation.refetch();
        }, VAULTS_REFETCH_INTERVAL);

        return () => clearInterval(agentVaultsInformationFetchInterval);
    }, []);

    const columns: IFAssetColumn[] = [
        {
            id: 'type',
            label: t('vaults_card.table.type_label'),
            render: (vault: IVault) => <CurrencyIcon
                currency={vault.fasset!}
                width="26"
                height="26"
                className="mr-1 self-center shrink-0"
            />

        },
        {
            id: 'address',
            label: t('vaults_card.table.vault_address_label'),
            render: (vault: IVault) => {
                return (
                    <div>
                        <div className="flex items-center">
                            <Text
                                size="sm"
                                c="var(--flr-dark)"
                            >
                                {truncateString(vault.address, 5, 5)}
                            </Text>
                            <CopyIcon
                                text={vault.address}
                            />
                        </div>
                        <div className="flex">
                            <Text
                                size="xs"
                                c="var(--flr-portal-dark)"
                                className="mr-2"
                            >
                                {vault.fasset}
                            </Text>
                            <Text
                                size="xs"
                                c="var(--flr-portal-dark)"
                            >
                                {vault.collateralToken}
                            </Text>
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'agent',
            label: t('vaults_card.table.agent_label'),

            render: (vault: IVault) => {
                return (
                    1
                )
            }
        },
        {
            id: 'status',
            label: t('vaults_card.table.status_health_label'),
            render: (vault: IVault) => {
                const statuses: { [key: string]: string } = {
                    'Healthy': t('vaults_card.table.health_status_healthy_label'),
                    'CCB': t('vaults_card.table.health_status_ccb_label'),
                    'In Liquidation': t('vaults_card.table.health_status_in_liquidation_label'),
                    'In full liquidation': t('vaults_card.table.health_status_in_full_liquidation_label'),
                    'Closing': t('vaults_card.table.health_status_closing_label')
                };

                let textColor = 'var(--mantine-color-gray-7)';
                if (vault.health === 'Healthy') {
                    textColor = 'var(--green-default)'
                } else if (['In Liquidation', 'In full liquidation'].includes(vault.health)) {
                    textColor = 'var(--dark-red-default)';
                } else if (vault.health === 'CCB') {
                    textColor = 'var(--orange-default)';
                }

                let textColorStatus = 'var(--dark-red-default)';
                if (vault.status) {
                    textColorStatus = 'var(--green-default)';
                }

                return (
                    <div>
                        <div className="flex items-center mb-1">
                            <Badge
                                variant="outline"
                                color={textColor}
                                radius="xs"
                                className={`mr-1 font-normal`}
                            >
                                <div className="flex items-center">
                                    <span className="status-dot mr-2" style={{ backgroundColor: textColor }}></span>
                                    <span style={{ color: textColor }}>{statuses[vault.health]}</span>
                                </div>
                            </Badge>
                            <Badge
                                variant="outline"
                                color={textColorStatus}
                                radius="xs"
                                className={`font-normal`}
                            >
                                <div className="flex items-center">
                                    <span className="status-dot mr-2" style={{ backgroundColor: textColorStatus }}></span>
                                    <span style={{ color: textColorStatus }}>
                                            {t(`vaults_card.table.status_${vault.status ? 'live' : 'not_listed'}_label`)}
                                        </span>
                                </div>
                            </Badge>
                        </div>
                        {
                            vault.numLiquidations !== undefined &&
                            <Badge
                                variant="outline"
                                color="var(--mantine-color-gray-7)"
                                radius="xs"
                                className={`mr-1 font-normal ${textColor}`}
                            >
                                {vault.numLiquidations} {t('agents.table.past_liq_label')}
                            </Badge>
                        }
                    </div>
                );
            }
        },
        {
            id: 'freeLots',
            label: t('vaults_card.table.free_lots_label'),
            render: (vault: IVault) => `${vault.freeLots}`
        },
        {
            id: 'vaultCollateral',
            label: t('vaults_card.table.vault_collateral_label'),
            render: (vault: IVault) => {
                let vaultCr = vault.vaultCR;
                if (isMaxCRValue(vaultCr)) {
                    vaultCr = '∞'
                } else {
                    vaultCr = toNumber(vaultCr).toPrecision(3);
                }

                return (
                    <div className="flex items-center">
                        <div className="mr-5">
                            <Text
                                size="sm"
                            >
                                {vaultCr}
                            </Text>
                            <Text
                                size="xs"
                                c="var(--flr-darker-gray)"
                            >
                                {t('vaults_card.table.cr_label')}
                            </Text>
                        </div>
                        <div className="mr-5">
                            <Text
                                size="sm"
                            >
                                {vault.vaultAmount}
                            </Text>
                            <Text
                                size="xs"
                                c="var(--flr-darker-gray)"
                            >
                                {t('vaults_card.table.amount_label')}
                            </Text>
                        </div>
                        <div>
                            <Text
                                size="sm"
                            >
                                {vault.lotsVaultBacked}
                            </Text>
                            <Text
                                size="xs"
                                c="var(--flr-darker-gray)"
                            >
                                {t('vaults_card.table.lots_label')}
                            </Text>
                        </div>
                    </div>
                );
            }
        },
        {
            id: 'poolCollateral',
            label: t('vaults_card.table.pool_collateral_label'),
            render: (vault: IVault) => {
                let poolCR = vault.poolCR;
                if (isMaxCRValue(poolCR)) {
                    poolCR = '∞'
                } else {
                    poolCR = toNumber(poolCR).toPrecision(3);
                }

                return (
                    <div className="flex items-center">
                        <div className="mr-5">
                            <Text
                                size="sm"
                            >
                                {poolCR}
                            </Text>
                            <Text
                                size="xs"
                                c="var(--flr-darker-gray)"
                            >
                                {t('vaults_card.table.cr_label')}
                            </Text>
                        </div>
                        <div className="mr-5">
                            <Text
                                size="sm"
                            >
                                {vault.poolAmount}
                            </Text>
                            <Text
                                size="xs"
                                c="var(--flr-darker-gray)"
                            >
                                {t('vaults_card.table.amount_label')}
                            </Text>
                        </div>
                        <div>
                            <Text
                                size="sm"
                            >
                                {vault.lotsPoolBacked}
                            </Text>
                            <Text
                                size="xs"
                                c="var(--flr-darker-gray)"
                            >
                                {t('vaults_card.table.lots_label')}
                            </Text>
                        </div>
                    </div>
                );
            }
        },
        {
            id: 'pool_fee',
            label: t('vaults_card.table.pool_fee'),
            sorted: true,
            render: (vault: IVault) => {
                return (
                    <Text
                        size="sm"
                    >
                        {vault.poolFee || '0'} <span className="text-[var(--flr-darker-gray)]">%</span>
                    </Text>
                );
            }
        },
        {
            id: 'actions',
            label: t('vaults_card.table.actions_label'),
            headerClassName: 'text-right',
            className: `uppercase text-right ${agentVaultsInformation.data?.length !== 0 ? classes.sticky : ''}`,
            render: (vault: IVault) => {
                return(
                    <Menu>
                        <Menu.Target>
                            <IconDots
                                style={{ width: rem(20), height: rem(20) }}
                                className="cursor-pointer ml-auto"
                            />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>{t('vaults_card.table.actions_menu.vault_actions_label')}</Menu.Label>
                            <Menu.Item
                                leftSection={<IconBook2 style={{ width: rem(14), height: rem(14) }} />}
                            >
                                <Link
                                    href={`/vault/${vault.fasset}/${vault.address}`}
                                >
                                    {t('vaults_card.table.actions_menu.view_vault_label')}
                                </Link>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Label>{t('vaults_card.table.actions_menu.agent_vault_operations_title')}</Menu.Label>
                            <Menu.Item
                                leftSection={<IconBookUpload style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_DEPOSIT_COLLATERAL_LOTS, vault)}
                            >
                                {t('vaults_card.table.actions_menu.deposit_collateral_lots_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconBookUpload style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_DEPOSIT_VAULT_COLLATERAL, vault)}
                            >
                                {t('vaults_card.table.actions_menu.deposit_vault_collateral_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconBookUpload style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_DEPOSIT_POOL_COLLATERAL, vault)}
                            >
                                {t('vaults_card.table.actions_menu.deposit_pool_collateral_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconBookDownload style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_WITHDRAW_COLLATERAL_POOL_TOKENS, vault)}
                            >
                                {t('vaults_card.table.actions_menu.withdraw_collateral_pool_tokens_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconBookDownload style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_WITHDRAW_VAULT_COLLATERAL, vault)}
                            >
                                {t('vaults_card.table.actions_menu.withdraw_vault_collateral_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconDashboard style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_ACTIVATE_VAULT, vault)}
                                disabled={vault.status}
                            >
                                {t('vaults_card.table.actions_menu.activate_vault_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconDashboardOff style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_DEACTIVATE_VAULT, vault)}
                            >
                                {t('vaults_card.table.actions_menu.deactivate_vault_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconDashboardOff style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_SELF_CLOSE, vault)}
                            >
                                {t('vaults_card.table.actions_menu.self_close_label')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconDashboardOff style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => onClick(MODAL_CLOSE_VAULT, vault)}
                                c="var(--mantine-color-red-9)"
                                bg="rgba(248, 233, 233, 1)"

                            >
                                {t('vaults_card.table.actions_menu.close_vault_label')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )
            }
        }
    ];

    const onClick = (modal: string, vault: IVault) => {
        if (modal === MODAL_DEPOSIT_VAULT_COLLATERAL) {
            setIsDepositVaultCollateralModalActive(true);
        } else if (modal === MODAL_DEPOSIT_POOL_COLLATERAL) {
            setIsDepositPoolCollateralModalActive(true);
        } else if (modal === MODAL_ACTIVATE_VAULT) {
            setIsActivateVaultModalActive(true);
        } else if(modal === MODAL_DEACTIVATE_VAULT) {
            setIsDeactivateVaultModalActive(true);
        } else if (modal === MODAL_CLOSE_VAULT) {
            setIsCloseVaultModalActive(true);
        } else if (modal === MODAL_WITHDRAW_COLLATERAL_POOL_TOKENS) {
            setIsWithdrawCollateralPoolTokensModalActive(true);
        } else if (modal === MODAL_WITHDRAW_VAULT_COLLATERAL) {
            setIsWithdrawCollateralModalActive(true);
        } else if (modal === MODAL_SELF_CLOSE) {
            setIsSelfCloseModalActive(true);
        } else if (modal === MODAL_DEPOSIT_COLLATERAL_LOTS) {
            setIsDepositCollateralLotsModalActive(true);
        }
        setSelectedAgentVault(vault);
    }

    const refetchData = async () => {
        try {
            setIsLoading(true);
            await agentVaultsInformation.refetch();
            await balances.refetch();
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const onCloseDepositCollateralLotsModal = (refetch: boolean) => {
        setIsDepositCollateralLotsModalActive(false);
        if (refetch) {
            refetchData();
        }
    }

    const onCloseDepositPoolCollateralModal = (refetch: boolean) => {
        setIsDepositPoolCollateralModalActive(false);
        if (refetch) {
            refetchData();
        }
    }

    const onCloseDepositVaultCollateralModal = (refetch: boolean) => {
        setIsDepositVaultCollateralModalActive(false);
        if (refetch) {
            refetchData();
        }
    }

    return (
        <Paper
            className={`${className}`}
            withBorder
        >
             <Table.ScrollContainer
                 minWidth={900}
                 className={classes.tableScrollContainer}
             >
                <FAssetTable
                    className="fau-hover-row-table"
                    columns={columns}
                    items={agentVaultsInformation.data ?? []}
                    loading={agentVaultsInformation.isPending || isLoading}
                    emptyLabel={t('vaults_card.empty_vaults_label')}
                />
            </Table.ScrollContainer>
            {selectedAgentVault &&
                <>
                    <DepositCollateralLotsModal
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        opened={isDepositCollateralLotsModalActive}
                        onClose={onCloseDepositCollateralLotsModal}
                    />
                    <DepositVaultCollateralModal
                        vaultCollateralToken={selectedAgentVault.collateralToken}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        opened={isDepositVaultCollateralModalActive}
                        collateral={collateral}
                        onClose={onCloseDepositVaultCollateralModal}
                    />
                    <DepositPoolCollateralModal
                        opened={isDepositPoolCollateralModalActive}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        collateral={collateral}
                        onClose={onCloseDepositPoolCollateralModal}
                    />
                    <ActivateVaultModal
                        opened={isActivateVaultModalActive}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsActivateVaultModalActive(false)}
                    />
                    <DeactivateVaultModal
                        opened={isDeactivateVaultModalActive}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsDeactivateVaultModalActive(false)}
                    />
                    <CloseVaultModal
                        opened={isCloseVaultModalActive}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsCloseVaultModalActive(false)}
                    />
                    <WithdrawCollateralPoolTokensModal
                        opened={isWithdrawCollateralPoolTokensModalActive}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsWithdrawCollateralPoolTokensModalActive(false)}
                    />
                    <WithdrawVaultCollateralModal
                        opened={isWithdrawCollateralModalActive}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsWithdrawCollateralModalActive(false)}
                    />
                    <SelfCloseModal
                        opened={isSelfCloseModalActive}
                        fAssetSymbol={selectedAgentVault.fasset}
                        agentVaultAddress={selectedAgentVault.address}
                        onClose={() => setIsSelfCloseModalActive(false)}
                    />
                </>
            }
        </Paper>
    );
}
