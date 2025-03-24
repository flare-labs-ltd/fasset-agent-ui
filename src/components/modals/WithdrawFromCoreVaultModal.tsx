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
import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { IconExclamationCircle } from "@tabler/icons-react";
import { getIcon, formatNumberWithSuffix } from "@/utils";
import { useRequestableCvData, useRequestWithdrawalFromCv } from "@/api/agentVault";
import { modals } from "@mantine/modals";
import { useRouter } from "next/router";

interface IWithdrawFromCoreVaultModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
    redirect?: boolean;
}

interface IFormValues {
    amount: number | undefined;
}

export default function WithdrawFromCoreVaultModal({ opened, onClose, fAssetSymbol, agentVaultAddress, redirect }: IWithdrawFromCoreVaultModal) {
    const [errorMessage, setErrorMessage] = useState<string>();

    const { t } = useTranslation();
    const requestableCvData = useRequestableCvData(fAssetSymbol, agentVaultAddress, opened);
    const requestWithdrawalFromCv = useRequestWithdrawalFromCv();
    const tokenIcon = getIcon(fAssetSymbol, '16', 'mx-1');
    const router = useRouter();

    const schema = yup.object().shape({
        amount: yup.number().required(t('validation.messages.required', { field: t('withdraw_from_core_vault_modal.amount_label', { token: fAssetSymbol }) })).min(1),
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            amount: undefined
        },
        //@ts-ignore
        validate: yupResolver(schema)
    });

    const handleOnClose = () => {
        setErrorMessage(undefined);
        form.reset();
        onClose();
    }

    const openSuccessModal = () => {
        handleOnClose();
        modals.open({
            title: t('withdraw_from_core_vault_modal.title'),
            children: (
                <>
                    <Text>
                        {t('withdraw_from_core_vault_modal.success_message')}
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
                            {t('withdraw_from_core_vault_modal.close_button')}
                        </Button>
                    </div>
                </>
            ),
            centered: true
        });
    }

    const onSuccessModalClose = async () => {
        modals.closeAll();
        if (redirect) {
            await router.push('/');
        }
    }

    const onSubmit = async (amount: number) => {
        try {
            await requestWithdrawalFromCv.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                lots: amount
            });
            openSuccessModal();
        } catch (error: any) {
            if (error.message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('withdraw_from_core_vault_modal.error_message'));
            }
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={handleOnClose}
            title={t('withdraw_from_core_vault_modal.title')}
            size={600}
            centered
        >
            <LoadingOverlay visible={requestableCvData.isPending} />
            <form onSubmit={form.onSubmit(form => onSubmit(form.amount as number))}>
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
                    {...form.getInputProps('amount')}
                    min={1}
                    max={Math.min(requestableCvData.data?.requestableLotsVault  ?? 0, requestableCvData.data?.requestableLotsCV ?? 0)}
                    clampBehavior="strict"
                    label={t('withdraw_from_core_vault_modal.amount_label', { token: fAssetSymbol })}
                    description={t('withdraw_from_core_vault_modal.amount_description_label', { token: fAssetSymbol })}
                    placeholder={t('withdraw_from_core_vault_modal.amount_placeholder_label')}
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
                            {t('withdraw_from_core_vault_modal.vault_free_lots_label')}
                        </Text>
                        <div className="flex items-center mt-1">
                            <Text
                                c="var(--flr-gray)"
                                className="ml-1"
                                size="sm"
                            >
                                {t('withdraw_from_core_vault_modal.lots_label', { lots: requestableCvData.data?.requestableLotsVault })}
                            </Text>
                        </div>
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 12, xs: 6 }}
                        className="border-b min-[576px]:border-b-0 border-[var(--flr-border)] p-3"
                    >
                        <Text
                            c="var(--flr-gray)"
                            className="uppercase"
                            size="sm"
                        >
                            {t('withdraw_from_core_vault_modal.core_vault_balance_label')}
                        </Text>
                        <div className="flex justify-between mt-1">
                            <Text
                                c="var(--flr-gray)"
                                size="sm"
                            >
                                {t('withdraw_from_core_vault_modal.lots_label', {
                                    lots: requestableCvData.data?.requestableLotsCV
                                })}
                            </Text>
                            <Trans
                                i18nKey="withdraw_from_core_vault_modal.lot_size_label"
                                parent={Text}
                                c="var(--flr-gray)"
                                size="sm"
                                className="flex items-center"
                                components={{
                                    icon: tokenIcon!
                                }}
                                values={{
                                    lotSize: formatNumberWithSuffix(requestableCvData.data?.lotSize ?? 0, 0),
                                    token: fAssetSymbol
                                }}
                            />
                        </div>
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 12, xs: 6 }}
                        className="min-[576px]:border-t min-[576px]:border-r border-b min-[576px]:border-b-0 border-[var(--flr-border)] p-3"
                    >
                        <Text
                            c="var(--flr-gray)"
                            className="uppercase"
                            size="sm"
                        >
                            {t('withdraw_from_core_vault_modal.operation_days_label')}
                        </Text>
                        <Text
                            c="var(--flr-gray)"
                            size="sm"
                        >
                            {t('withdraw_from_core_vault_modal.estimated_label')}
                        </Text>
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 12, xs: 6 }}
                        className="min-[576px]:border-t border-[var(--flr-border)] p-3"
                    >
                        <Text
                            c="var(--flr-gray)"
                            className="uppercase"
                            size="sm"
                        >
                            {t('withdraw_from_core_vault_modal.max_return_label')}
                        </Text>
                        <Text
                            c="var(--flr-gray)"
                            size="sm"
                        >
                            {t('withdraw_from_core_vault_modal.lots_label', {
                                lots: Math.min(requestableCvData.data?.requestableLotsVault  ?? 0, requestableCvData.data?.requestableLotsCV ?? 0)
                            })}
                        </Text>
                    </Grid.Col>
                </Grid>
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
                        loading={requestWithdrawalFromCv.isPending}
                    >
                        {t('withdraw_from_core_vault_modal.withdraw_button')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
