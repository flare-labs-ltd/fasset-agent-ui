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
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { IconExclamationCircle } from "@tabler/icons-react";
import { getIcon, toNumber } from "@/utils";
import { useRequestTransferToCv, useTransferableCvData } from "@/api/agentVault";
import { modals } from "@mantine/modals";
import { useRouter } from "next/router";

interface ITransferToCoreVaultModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
    redirect?: boolean;
}

interface IFormValues {
    amount: number | undefined;
}

export default function TransferToCoreVaultModal({ opened, onClose, fAssetSymbol, agentVaultAddress, redirect }: ITransferToCoreVaultModal) {
    const [errorMessage, setErrorMessage] = useState<string>();

    const { t } = useTranslation();
    const transferableCvData = useTransferableCvData(fAssetSymbol, agentVaultAddress, opened);
    const requestTransferToCv = useRequestTransferToCv();
    const tokenIcon = getIcon(fAssetSymbol, '16');
    const router = useRouter();

    const schema = yup.object().shape({
        amount: yup.number().required(t('validation.messages.required', { field: t('transfer_to_core_vault_modal.amount_label', { token: fAssetSymbol }) })).min(1),
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
            title: t('transfer_to_core_vault_modal.title'),
            children: (
                <>
                    <Text>
                        {t('transfer_to_core_vault_modal.success_message')}
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
                            {t('transfer_to_core_vault_modal.close_button')}
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
            await requestTransferToCv.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount
            });
            openSuccessModal();
        } catch (error: any) {
            if (error.message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('transfer_to_core_vault_modal.error_message'));
            }
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={handleOnClose}
            title={t('transfer_to_core_vault_modal.title')}
            size={600}
            centered
        >
            <LoadingOverlay visible={transferableCvData.isPending} />
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
                    max={transferableCvData.data?.underlyingBalance ? toNumber(transferableCvData.data.underlyingBalance) : 0}
                    clampBehavior="strict"
                    label={t('transfer_to_core_vault_modal.amount_label', { token: fAssetSymbol })}
                    description={t('transfer_to_core_vault_modal.amount_description_label', { token: fAssetSymbol })}
                    placeholder={t('transfer_to_core_vault_modal.amount_placeholder_label')}
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
                            {t('transfer_to_core_vault_modal.owner_balance_label')}
                        </Text>
                        <div className="flex items-center mt-1">
                            {tokenIcon}
                            <Text
                                c="var(--flr-gray)"
                                className="ml-1"
                                size="sm"
                            >
                                {transferableCvData.data?.underlyingBalance}
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
                            {t('transfer_to_core_vault_modal.max_transfer_label')}
                        </Text>
                        <div className="flex items-center mt-1">
                            {tokenIcon}
                            <Text
                                c="var(--flr-gray)"
                                className="ml-1"
                                size="sm"
                            >
                                {transferableCvData.data?.transferableBalance}
                            </Text>
                        </div>
                    </Grid.Col>
                    <Grid.Col
                        span={12}
                        className="min-[576px]:border-t border-[var(--flr-border)] p-3"
                    >
                        <Text
                            c="var(--flr-gray)"
                            className="uppercase"
                            size="sm"
                        >
                            {t('transfer_to_core_vault_modal.operation_days_label')}
                        </Text>
                        <Text
                            c="var(--flr-gray)"
                            size="sm"
                        >
                            {t('transfer_to_core_vault_modal.estimated_label')}
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
                        loading={requestTransferToCv.isPending}
                    >
                        {t('transfer_to_core_vault_modal.transfer_button')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
