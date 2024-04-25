import {
    Modal,
    Group,
    Button,
    Anchor,
    TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useDepositCollateral } from '@/api/agentVault';
import { useRouter } from 'next/router';
import { useState } from "react";
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';

interface IDepositCollateralModal {
    opened: boolean,
    onClose: () => void
}

export default function DepositCollateralModal({ opened, onClose }: IDepositCollateralModal) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const depositCollateral = useDepositCollateral();
    const { t } = useTranslation();
    const router = useRouter();
    const { symbol, vaultId } = router.query;

    const schema = yup.object().shape({
        amount: yup.number().required(t('validation.messages.required', { field: t('deposit_collateral_modal.deposit_amount_label') }))
    });
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            amount: null,
        },
        validate: yupResolver(schema)
    });

    const onDepositCollateralSubmit = async(amount: number) => {
        const status = form.validate();
        if (status.hasErrors) return;

        try {
            setIsLoading(true);
            await depositCollateral.mutateAsync({
                fAssetSymbol: symbol,
                agentVaultAddress: vaultId,
                amount: amount
            })
            showSucessNotification(t('deposit_collateral_modal.success_message'));
        } catch (error) {
            if ((error as any).message) {
                showErrorNotification((error as any).message);
            } else {
                showErrorNotification(t('deposit_collateral_modal.error_message'));
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('deposit_collateral_modal.title')}
            centered
        >
            <form onSubmit={form.onSubmit(form => onDepositCollateralSubmit(form.amount))}>
                <TextInput
                    {...form.getInputProps('amount')}
                    label={t('deposit_collateral_modal.deposit_amount_label')}
                    description={t('deposit_collateral_modal.deposit_amount_description_label')}
                    placeholder={t('deposit_collateral_modal.deposit_amount_placeholder_label')}
                    withAsterisk
                />
                <Group justify="space-between" className="mt-5">
                    <Anchor
                        href="#"
                        target="_blank"
                        size="sm"
                        c="gray"
                    >
                        {t('deposit_collateral_modal.need_help_label')}
                    </Anchor>
                    <Button
                        type="submit"
                        loading={isLoading}
                    >
                        {t('deposit_collateral_modal.confirm_button')}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
