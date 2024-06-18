import {
    Modal,
    Group,
    Button,
    Anchor,
    TextInput,
    Text,
    Divider
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useDepositFLRInPool } from '@/api/poolCollateral';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useState } from 'react';

interface IDepositFLRModal {
    opened: boolean;
    onClose: () => void;
}
interface IFormValues {
    amount: number|undefined;
}

export default function DepositFLRModal({ opened, onClose }: IDepositFLRModal) {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
    const depositFLR = useDepositFLRInPool();
    const { t } = useTranslation();
    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;

    const schema = yup.object().shape({
        amount: yup.number().required(t('validation.messages.required', { field: t('deposit_flr_in_pool.deposit_amount_label', { vaultCollateralToken: 'FLR' }) }))
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            amount: undefined,
        },
        //@ts-ignore
        validate: yupResolver(schema)
    });

    const openSuccessModal = () => {
        onClose();
        modals.open({
            title: t('deposit_flr_in_pool.title'),
            children: (
                <>
                    <Text>
                        {t('deposit_flr_in_pool.success_message')}
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
                            { t('deposit_flr_in_pool.close_button')}
                        </Button>
                    </div>
                </>
            ),
            centered: true
        });
    }

    const openErrorModal = (errorMessage: string) => {
        setIsModalVisible(false);
        modals.open({
            title: t('deposit_flr_in_pool.title'),
            children: (
                <>
                    <Text>
                        {errorMessage}
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
                            { t('deposit_flr_in_pool.close_button')}
                        </Button>
                    </div>
                </>
            ),
            centered: true,
            onClose: () => setIsModalVisible(true)
        });
    }

    const onDepositCollateralSubmit = async(amount: number) => {
        const status = form.validate();
        if (status.hasErrors) return;

        try {
            await depositFLR.mutateAsync({
                fAssetSymbol: fAssetSymbol as string,
                agentVaultAddress: agentVaultAddress as string,
                amount: amount
            });
            openSuccessModal();
        } catch (error) {
            if ((error as any).message) {
                openErrorModal((error as any).response.data.message);
            } else {
                openErrorModal(t('deposit_flr_in_pool.error_message'));
            }
        }
    }

    return (
        <Modal
            opened={isModalVisible && opened}
            onClose={onClose}
            title={t('deposit_flr_in_pool.title')}
            closeOnClickOutside={!depositFLR.isPending}
            closeOnEscape={!depositFLR.isPending}
            centered
        >
            <form onSubmit={form.onSubmit(form => onDepositCollateralSubmit(form.amount as number))}>
                <TextInput
                    {...form.getInputProps('amount')}
                    label={t('deposit_flr_in_pool.deposit_amount_label', { vaultCollateralToken: 'FLR' })}
                    description={t('deposit_flr_in_pool.deposit_amount_description_label')}
                    placeholder={t('deposit_flr_in_pool.deposit_amount_placeholder_label')}
                    withAsterisk
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
                        href="https://docs.flare.network/tech/fassets"
                        target="_blank"
                        size="sm"
                        c="gray"
                    >
                        {t('deposit_flr_in_pool.need_help_label')}
                    </Anchor>
                    <Button
                        type="submit"
                        loading={depositFLR.isPending}
                        fw={400}
                    >
                        {t('deposit_flr_in_pool.confirm_button')}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
