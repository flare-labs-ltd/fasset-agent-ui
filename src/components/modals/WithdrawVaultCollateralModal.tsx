import { useState } from "react";
import {
    Modal,
    Button,
    Text,
    Divider,
    NumberInput,
    rem,
    Anchor,
    Group,
    LoadingOverlay
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { IconExclamationCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { toNumber } from "@/utils";
import { useFreeVaultBalance, useWithdrawVault } from "@/api/agentVault";

interface IWithdrawVaultCollateralModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

interface IFormValues {
    amount: number|undefined;
}

export default function WithdrawVaultCollateralModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: IWithdrawVaultCollateralModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const freeVaultBalance = useFreeVaultBalance(fAssetSymbol, agentVaultAddress, opened);
    const withdrawVault = useWithdrawVault();
    const { t } = useTranslation();

    const amount = toNumber(freeVaultBalance?.data?.data?.balance ?? '0');
    const schema = yup.object().shape({
        amount: yup.number()
            .required(t('validation.messages.required', { field: t('withdraw_vault_collateral_modal.withdraw_amount_label') }))
            .min(1)
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            amount: undefined,
        },
        //@ts-ignore
        validate: yupResolver(schema),
        onValuesChange: (values: any) => {
            if (values?.amount?.length === 0) {
                form.setFieldValue('amount', undefined);
            }
        }
    });

    const onWithdrawVaultClick = async (amount: number) => {
        try {
            await withdrawVault.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount
            });
            openSuccessModal();
        } catch (error: any) {
            if ((error as any).message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('withdraw_vault_collateral_modal.error_message'));
            }
        }
    }

    const handleOnClose = () => {
        setErrorMessage(undefined);
        form.reset();
        onClose();
    }

    const openSuccessModal = () => {
        handleOnClose();
        modals.open({
            title: t('withdraw_vault_collateral_modal.title'),
            children: (
                <>
                    <Text>
                        {t('withdraw_vault_collateral_modal.success_message')}
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
                        <Button
                            onClick={() => modals.closeAll()}
                        >
                            { t('withdraw_vault_collateral_modal.close_button')}
                        </Button>
                    </div>
                </>
            ),
            centered: true
        });
    }

    return (
        <Modal
            opened={opened}
            onClose={handleOnClose}
            title={t('withdraw_vault_collateral_modal.title')}
            closeOnClickOutside={!withdrawVault.isPending}
            closeOnEscape={!withdrawVault.isPending}
            centered
        >
            <LoadingOverlay visible={freeVaultBalance.isPending} />
            <form onSubmit={form.onSubmit(form => onWithdrawVaultClick(form.amount as number))}>
                {errorMessage &&
                    <div className="flex items-center mb-5 border border-red-700 p-3 bg-red-100">
                        <IconExclamationCircle
                            style={{ width: rem(25), height: rem(25) }}
                            color="var(--flr-red)"
                            className="mr-3"
                        />
                        <Text
                            size="sm"
                            c="var(--flr-red)"
                        >
                            {errorMessage}
                        </Text>
                    </div>
                }
                <Text>{t('withdraw_vault_collateral_modal.description_label', {amount: amount})}</Text>
                <NumberInput
                    {...form.getInputProps('amount')}
                    min={0}
                    max={amount}
                    label={t('withdraw_vault_collateral_modal.withdraw_amount_label')}
                    placeholder={t('withdraw_vault_collateral_modal.withdraw_amount_label')}
                    withAsterisk
                    className="mt-5"
                />
                <Divider
                    className="my-8"
                    styles={{
                        root: {
                            marginLeft: '-2rem',
                            marginRight: '-2rem'
                        }
                    }}
                />
                <Group justify="space-between" className="mt-5">
                    <Anchor
                        href="https://docs.flare.network/infra/fassets/agent/"
                        target="_blank"
                        size="sm"
                        c="gray"
                    >
                        {t('withdraw_vault_collateral_modal.need_help_label')}
                    </Anchor>
                    <Button
                        type="submit"
                        loading={withdrawVault.isPending}
                        fw={400}
                    >
                        {t('withdraw_vault_collateral_modal.confirm_button')}
                    </Button>
                </Group>
            </form>
        </Modal>
    )
}
