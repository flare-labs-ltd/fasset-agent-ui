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
import { useDepositFLRInPool } from '@/api/poolCollateral';
import { useRouter } from 'next/router';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';

interface IDepositFLRModal {
    opened: boolean;
    onClose: () => void;
}

export default function DepositFLRModal({ opened, onClose }: IDepositFLRModal) {
    const depositFLR = useDepositFLRInPool();
    const { t } = useTranslation();
    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;

    const schema = yup.object().shape({
        amount: yup.number().required(t('validation.messages.required', { field: t('deposit_flr_in_pool.deposit_amount_label', { vaultCollateralToken: 'FLR' }) }))
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
            await depositFLR.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount
            });
            showSucessNotification(t('deposit_flr_in_pool.success_message'));
        } catch (error) {
            if ((error as any).message) {
                showErrorNotification((error as any).response.data.message);
            } else {
                showErrorNotification(t('deposit_flr_in_pool.error_message'));
            }
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('deposit_flr_in_pool.title')}
            closeOnClickOutside={!depositFLR.isPending}
            closeOnEscape={!depositFLR.isPending}
            centered
        >
            <form onSubmit={form.onSubmit(form => onDepositCollateralSubmit(form.amount))}>
                <TextInput
                    {...form.getInputProps('amount')}
                    label={t('deposit_flr_in_pool.deposit_amount_label', { vaultCollateralToken: 'FLR' })}
                    description={t('deposit_flr_in_pool.deposit_amount_description_label')}
                    placeholder={t('deposit_flr_in_pool.deposit_amount_placeholder_label')}
                    withAsterisk
                />
                <Group justify="space-between" className="mt-5">
                    <Anchor
                        href="#"
                        target="_blank"
                        size="sm"
                        c="gray"
                    >
                        {t('deposit_flr_in_pool.need_help_label')}
                    </Anchor>
                    <Button
                        type="submit"
                        loading={depositFLR.isPending}
                    >
                        {t('deposit_flr_in_pool.confirm_button')}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
