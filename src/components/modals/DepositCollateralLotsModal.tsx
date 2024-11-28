import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Modal,
    NumberInput,
    rem,
    Text,
    Grid
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import  {yupResolver } from "mantine-form-yup-resolver";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useCalculateCollaterals, useDepositCollaterals } from "@/api/agentVault";
import { ICalculateCollateral } from "@/types";
import UsdcIcon from "@/components/icons/UsdcIcon";
import UsdtIcon from "@/components/icons/UsdtIcon";
import CflrIcon from "@/components/icons/CflrIcon";
import XrpIcon from "@/components/icons/XrpIcon";
import EthIcon from "@/components/icons/EthIcon";
import BtcIcon from "@/components/icons/BtcIcon";
import DogeIcon from "@/components/icons/DogeIcon";
import SgbIcon from "@/components/icons/SgbIcon";

interface IDepositCollateralLotsModal {
    opened: boolean;
    fAssetSymbol: string;
    agentVaultAddress: string;
    onClose: (refetch: boolean) => void;
}

interface IFormValues {
    lots: number | undefined;
    multiplier: number | undefined;
}

interface ILocalCalculateCollateral extends ICalculateCollateral {
    icon?: React.ReactNode | undefined;
}

export default function DepositCollateralLotsModal({ opened, fAssetSymbol, agentVaultAddress, onClose }: IDepositCollateralLotsModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [lots, setLots] = useState<number>();
    const [multiplier, setMultiplier] = useState<number>();
    const [vaultCollateral, setVaultCollateral] = useState<ILocalCalculateCollateral>();
    const [poolCollateral, setPoolCollateral] = useState<ILocalCalculateCollateral>();
    const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false);
    const { t } = useTranslation();

    const schema = yup.object().shape({
        lots: yup.number().required(t('validation.messages.required', { field: t('deposit_collateral_lots_modal.form.lots_label') })).min(1),
        multiplier: yup.number().required(t('validation.messages.required', { field: t('deposit_collateral_lots_modal.form.multiplier_label') })).min(1).max(2),
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            lots: undefined,
            multiplier: undefined
        },
        //@ts-ignore
        validate: yupResolver(schema),
        onValuesChange: (values: any) => {
            setIsSummaryVisible(false);
        }
    });

    const depositCollaterals = useDepositCollaterals();
    const calculateCollaterals = useCalculateCollaterals(
        fAssetSymbol,
        agentVaultAddress,
        lots ?? 0,
        multiplier ?? 0,
        opened && lots !== undefined && multiplier !== undefined
    );

    useEffect(() => {
        if (!calculateCollaterals.data) return;

        const pool: ILocalCalculateCollateral | undefined = calculateCollaterals.data.find(collateral => collateral.symbol.toLowerCase().includes('flr') || collateral.symbol.toLowerCase().includes('sgb'));
        const vault: ILocalCalculateCollateral | undefined = calculateCollaterals.data.find(collateral => collateral.symbol.toLowerCase().includes('eth') || collateral.symbol.toLowerCase().includes('usd'));
        
        if (vault) {
            vault.icon = getIcon(vault.symbol);
            setVaultCollateral(vault);
        }
        if (pool) {
            pool.icon = getIcon(pool.symbol);
            setPoolCollateral(pool);
        }

        if (vault && pool) {
            setIsSummaryVisible(true);
        }
    }, [calculateCollaterals.data]);

    const openSuccessModal = () => {
        handleOnClose(true);
        modals.open({
            title: t('deposit_collateral_lots_modal.title'),
            children: (
                <>
                    <Text>
                        {t('deposit_collateral_lots_modal.success_message')}
                    </Text>
                    <Divider
                        className="my-8"
                        styles={{
                            root: {
                                marginLeft: '-2rem',
                                marginRight: '-2rem'
                            }
                        }}
                    />
                    <div className="flex justify-end mt-4">
                        <Button onClick={() => modals.closeAll()}>
                            {t('deposit_collateral_lots_modal.close_button')}
                        </Button>
                    </div>
                </>
            ),
            centered: true
        });
    }

    const handleOnClose = (refetch: boolean = false) => {
        setErrorMessage(undefined);
        form.reset();
        setPoolCollateral(undefined);
        setVaultCollateral(undefined);
        setLots(undefined);
        setMultiplier(undefined);
        onClose(refetch);
    }

    const onCalculate = async (lots: number, multiplier: number) => {
        setLots(lots);
        setMultiplier(multiplier);
    }

    const getIcon = (token: string) => {
        if (token.toLowerCase().includes('usdc')) {
            return <UsdcIcon width="16" height="16" className="flex-shrink-0" />;
        } else if (token.toLowerCase().includes('usdt')) {
            return <UsdtIcon width="16" height="16" className="flex-shrink-0" />;
        } else if (token.toLowerCase().includes('flr')) {
            return <CflrIcon width="16" height="16" className="flex-shrink-0" />;
        } else if (token.toLowerCase().includes('xrp')) {
            return <XrpIcon width="16" height="16" className="flex-shrink-0" />;
        } else if (token.toLowerCase().includes('eth')) {
            return <EthIcon width="16" height="16" className="flex-shrink-0" />;
        } else if (token.toLowerCase().includes('btc')) {
            return <BtcIcon width="16" height="16" className="flex-shrink-0" />;
        } else if (token.toLowerCase().includes('doge')) {
            return <DogeIcon width="16" height="16" className="flex-shrink-0" />;
        } else if (token.toLowerCase().includes('sgb')) {
            return <SgbIcon width="16" height="16" className="flex-shrink-0" />;
        }
    }

    const onSubmit = async () => {
        try {
            await depositCollaterals.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                lots: lots!,
                multiplier: multiplier!
            });
            openSuccessModal();
        } catch (error: any) {
            if (error.message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('deposit_collateral_lots_modal.error_message'));
            }
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={handleOnClose}
            title={t('deposit_collateral_lots_modal.title')}
            size={540}
            centered
        >
            <form
                onSubmit={form.onSubmit(form => !isSummaryVisible ? onCalculate(form.lots as number, form.multiplier as number) : onSubmit())}
            >
                {errorMessage &&
                    <div className="flex items-center mb-5 border border-red-700 p-3 bg-red-100">
                        <IconExclamationCircle
                            style={{ width: rem(25), height: rem(25) }}
                            color="var(--flr-red)"
                            className="mr-3 flex-shrink-0"
                        />
                        <Text
                            size="sm"
                            c="var(--flr-red)"
                        >
                            {errorMessage}
                        </Text>
                    </div>
                }
                <NumberInput
                    {...form.getInputProps('lots')}
                    min={1}
                    label={t('deposit_collateral_lots_modal.form.lots_label')}
                    description={t('deposit_collateral_lots_modal.form.lots_description_label')}
                    placeholder={t('deposit_collateral_lots_modal.form.lots_placeholder_label')}
                    withAsterisk
                />
                <NumberInput
                    {...form.getInputProps('multiplier')}
                    decimalScale={2}
                    min={1}
                    label={t('deposit_collateral_lots_modal.form.multiplier_label')}
                    description={t('deposit_collateral_lots_modal.form.multiplier_description_label')}
                    placeholder={t('deposit_collateral_lots_modal.form.multiplier_placeholder_label')}
                    withAsterisk
                    className="mt-3"
                />
                {isSummaryVisible &&
                    <Grid
                        className="mt-5"
                        classNames={{
                            inner: 'border border-[var(--flr-border)]'
                        }}
                    >
                        <Grid.Col span={12} className="border-b border-[var(--flr-border)] px-5 py-3">
                            <Text
                                c="var(--flr-gray)"
                                className="uppercase"
                            >
                                {t('deposit_collateral_lots_modal.summary.deposit_summary_label')}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={6} className="border-b border-r border-[var(--flr-border)] px-5 py-3">
                            <Text
                                c="var(--flr-gray)"
                                size="xs"
                                className="uppercase mb-1"
                            >
                                {t('deposit_collateral_lots_modal.summary.vault_collateral_label')}
                            </Text>
                            <div className="flex items-center">
                                {vaultCollateral?.icon}
                                <Text
                                    c="var(--flr-gray)"
                                    className="ml-1 leading-4"
                                >
                                    {vaultCollateral?.amount} {vaultCollateral?.symbol}
                                </Text>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={6} className="border-b border-[var(--flr-border)] px-5 py-3">
                            <Text
                                c="var(--flr-gray)"
                                size="xs"
                                className="uppercase mb-1"
                            >
                                {t('deposit_collateral_lots_modal.summary.working_address_balance_label')}
                            </Text>
                            <Text
                                c="var(--flr-gray)"
                                className="leading-4"
                            >
                                {vaultCollateral?.ownerBalance} {vaultCollateral?.symbol}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={6} className="border-r border-[var(--flr-border)] px-5 py-3">
                            <Text
                                c="var(--flr-gray)"
                                size="xs"
                                className="uppercase mb-1"
                            >
                                {t('deposit_collateral_lots_modal.summary.pool_collateral_label')}
                            </Text>
                            <div className="flex items-center">
                                {poolCollateral?.icon}
                                <Text
                                    c="var(--flr-gray)"
                                    className="ml-1 leading-4"
                                >
                                    {poolCollateral?.amount} {poolCollateral?.symbol}
                                </Text>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={6} className="px-5 py-3">
                            <Text
                                c="var(--flr-gray)"
                                size="xs"
                                className="uppercase mb-1"
                            >
                                {t('deposit_collateral_lots_modal.summary.working_address_balance_label')}
                            </Text>
                            <Text
                                c="var(--flr-gray)"
                                className="leading-4"
                            >
                                {poolCollateral?.ownerBalance} {poolCollateral?.symbol}
                            </Text>
                        </Grid.Col>
                    </Grid>
                }
                <Divider
                    className="my-8"
                    styles={{
                        root: {
                            marginLeft: '-2rem',
                            marginRight: '-2rem'
                        }
                    }}
                />
                <div className="flex justify-end mt-5">
                    <Button
                        type="submit"
                        fw={400}
                        loading={calculateCollaterals.isLoading || depositCollaterals.isPending}
                    >
                        {t(!isSummaryVisible ? 'deposit_collateral_lots_modal.calculate_button' : 'deposit_collateral_lots_modal.deposit_button')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
