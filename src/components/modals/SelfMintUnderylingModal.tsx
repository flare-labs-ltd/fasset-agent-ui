import React, { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Text,
    Divider,
    NumberInput,
    rem,
    LoadingOverlay,
    Grid
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Trans, useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { IconExclamationCircle } from "@tabler/icons-react";
import {
    useAmountForSelfMintFromFreeUnderlying,
    useGetSelfMintUnderlyingBalances,
    useSelfMintFromFreeUnderlying
} from "@/api/agentVault";
import { getIcon } from "@/utils";
import { useRouter } from "next/router";

interface ISelfMintUnderlyingModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
    redirect?: boolean;
}

interface IFormValues {
    lots: number | undefined;
}

export default function SelfMintUnderlyingModal({ opened, onClose, fAssetSymbol, agentVaultAddress, redirect }: ISelfMintUnderlyingModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false);
    const [lots, setLots] = useState<number>();

    const router = useRouter();
    const { t } = useTranslation();
    const balance = useGetSelfMintUnderlyingBalances(fAssetSymbol, agentVaultAddress, opened);
    const amountForSelfMint = useAmountForSelfMintFromFreeUnderlying(fAssetSymbol, agentVaultAddress, lots as number, lots !== undefined);
    const selfMint = useSelfMintFromFreeUnderlying();

    const tokenIcon = getIcon(fAssetSymbol, '16');
    const nativeTokenName = fAssetSymbol.toLowerCase().match(/xrp|doge|btc/)![0].toUpperCase();

    const schema = yup.object().shape({
        lots: yup.number().required(t('validation.messages.required', { field: t('self_mint_underlying_modal.lots_label') })).min(1),
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            lots: undefined
        },
        //@ts-ignore
        validate: yupResolver(schema),
        onValuesChange: (values: any) => {
            setIsSummaryVisible(false);
        }
    });

    useEffect(() => {
        if (!amountForSelfMint.data) return;

        setIsSummaryVisible(true);
    }, [amountForSelfMint.data]);

    const handleOnClose = () => {
        setErrorMessage(undefined);
        form.reset();
        setLots(undefined);
        setIsSummaryVisible(false);
        onClose();
    }

    const openSuccessModal = () => {
        handleOnClose();
        modals.open({
            title: t('self_mint_underlying_modal.title'),
            children: (
                <>
                    <Text>
                        {t('self_mint_underlying_modal.success_message')}
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
                        <Button onClick={onSuccessModalClose}>
                            {t('self_mint_underlying_modal.close_button')}
                        </Button>
                    </div>
                </>
            ),
            centered: true
        });
    }

    const onSuccessModalClose = () => {
        modals.closeAll();
        if (redirect) {
            router.push('/');
        }
    }

    const onSubmit = async (lots: number) => {
        try {
            await selfMint.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                lots: lots
            });
            openSuccessModal();
        } catch (error: any) {
            if (error.message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('self_mint_underlying_modal.error_message'));
            }
        }
    }

    const onCalculate = (lots: number) => {
        setLots(lots);
    }

    return (
        <Modal
            opened={opened}
            onClose={handleOnClose}
            title={t('self_mint_underlying_modal.title')}
            size={600}
            centered
        >
            <LoadingOverlay visible={balance.isPending} />
            <form
                onSubmit={form.onSubmit(form => !isSummaryVisible ? onCalculate(form.lots as number) : onSubmit(form.lots as number))}
            >
                {errorMessage &&
                    <div className="flex items-center mb-5 border border-red-700 p-3 bg-red-100">
                        <IconExclamationCircle
                            style={{width: rem(25), height: rem(25)}}
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
                    clampBehavior="strict"
                    label={t('self_mint_underlying_modal.lots_label')}
                    description={t('self_mint_underlying_modal.lots_description_label')}
                    placeholder={t('self_mint_underlying_modal.lots_placeholder_label')}
                    withAsterisk
                />
                <Grid
                    className="my-6"
                    classNames={{
                        inner: 'border-y border-[var(--flr-border)]'
                    }}
                    styles={{
                        root: {
                            '--grid-gutter': 0
                        }
                    }}
                >
                    <Grid.Col
                        span={{ base: 12, xs: 6 }}
                        className="border-b min-[576px]:border-b-0 min-[576px]:border-r border-[var(--flr-border)] p-3"
                    >
                        <Text
                            c="var(--flr-gray)"
                            className="uppercase"
                            size="sm"
                        >
                            {t('self_mint_underlying_modal.free_underlying_balance_label')}
                        </Text>
                        <div className="flex items-center mt-1">
                            {tokenIcon}
                            <Text
                                c="var(--flr-gray)"
                                className="ml-1"
                                size="sm"
                            >
                                {balance.data?.freeUnderlyingBalance}
                            </Text>
                        </div>
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 12, xs: 6 }}
                        className="p-3"
                    >
                        <Text
                            c="var(--flr-gray)"
                            className="uppercase"
                            size="sm"
                        >
                            {t('self_mint_underlying_modal.available_lots_label')}
                        </Text>
                        <div className="flex items-center justify-between mt-1">
                            <Text
                                c="var(--flr-gray)"
                                size="sm"
                                className="mr-2"
                            >
                                {balance.data?.freeLots}
                            </Text>
                            <Trans
                                i18nKey="self_mint_underlying_modal.lot_label"
                                parent={Text}
                                size="sm"
                                c="var(--flr-gray)"
                                className="flex items-center whitespace-break-spaces"
                                //@ts-ignore
                                components={{
                                    icon: tokenIcon
                                }}
                                values={{
                                    amount: balance.data?.lotSize,
                                    fAssetSymbol: nativeTokenName
                                }}
                            />
                        </div>
                    </Grid.Col>
                </Grid>
                <Text
                    c="var(--flr-gray)"
                >
                    {t('self_mint_underlying_modal.agent_description_label')}
                </Text>
                {isSummaryVisible &&
                    <Grid
                        className="mt-8"
                        classNames={{
                            inner: 'border border-[var(--flr-border)]'
                        }}
                    >
                        <Grid.Col span={12} className="border-b border-[var(--flr-border)] p-3">
                            <Text
                                c="var(--flr-gray)"
                                className="uppercase"
                            >
                                {t('self_mint_underlying_modal.summary.self_mint_summary_label')}
                            </Text>
                        </Grid.Col>
                        <Grid.Col
                            span={{ base: 12, xs: 6 }}
                            className="border-b min-[576px]:border-b-0 min-[576px]:border-r border-[var(--flr-border)] p-3"
                        >
                            <Text
                                c="var(--flr-gray)"
                                size="sm"
                                className="uppercase"
                            >
                                {t('self_mint_underlying_modal.summary.nr_lots_label')}
                            </Text>
                            <Text
                                c="var(--flr-gray)"
                                size="sm"
                                className="mt-1"
                            >
                                {lots}
                            </Text>
                        </Grid.Col>
                        <Grid.Col
                            span={{ base: 12, xs: 6 }}
                            className="p-3"
                        >
                            <Text
                                c="var(--flr-gray)"
                                size="sm"
                                className="uppercase"
                            >
                                {t('self_mint_underlying_modal.summary.amount_to_pay_label')}
                            </Text>
                            <div className="flex items-center mt-1">
                                {tokenIcon}
                                <Text
                                    c="var(--flr-gray)"
                                    size="sm"
                                    className="mx-1"
                                >
                                    {amountForSelfMint.data?.amountToPay}
                                </Text>
                                <Text
                                    c="var(--flr-gray)"
                                    size="sm"
                                >
                                    {nativeTokenName}
                                </Text>
                            </div>

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
                        loading={amountForSelfMint.isLoading || selfMint.isPending}
                    >
                        {t(!isSummaryVisible ? 'self_mint_underlying_modal.calculate_button' : 'self_mint_underlying_modal.self_mint_button')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
