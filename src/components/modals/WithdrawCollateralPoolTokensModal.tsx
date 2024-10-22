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
import { IconExclamationCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useTranslation } from "react-i18next";
import { usePoolBalance, useWithdrawPool } from "@/api/poolCollateral";
import { toNumber } from "@/utils";

interface IWithdrawCollateralPoolTokensModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

interface IFormValues {
    amount: number|undefined;
}

export default function WithdrawCollateralPoolTokensModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: IWithdrawCollateralPoolTokensModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const poolBalance = usePoolBalance(fAssetSymbol, agentVaultAddress, opened);
    const withdrawPool = useWithdrawPool();
    const { t } = useTranslation();

    const amount = toNumber(poolBalance?.data?.data?.balance ?? '0');
    const schema = yup.object().shape({
        amount: yup.number()
            .required(t('validation.messages.required', { field: t('withdraw_collateral_pool_tokens_modal.withdraw_amount_label') }))
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

    const onWithdrawPoolClick = async (amount: number) => {
        try {
            await withdrawPool.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount
            });
            openSuccessModal();
        } catch (error: any) {
            if ((error as any).message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('withdraw_collateral_pool_tokens_modal.error_message'));
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
            title: t('withdraw_collateral_pool_tokens_modal.title'),
            children: (
                <>
                    <Text>
                        {t('withdraw_collateral_pool_tokens_modal.success_message')}
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
                            { t('withdraw_collateral_pool_tokens_modal.close_button')}
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
            title={t('withdraw_collateral_pool_tokens_modal.title')}
            closeOnClickOutside={!withdrawPool.isPending}
            closeOnEscape={!withdrawPool.isPending}
            centered
        >
            <LoadingOverlay visible={poolBalance.isPending} />
            <form onSubmit={form.onSubmit(form => onWithdrawPoolClick(form.amount as number))}>
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
                <Text>{t('withdraw_collateral_pool_tokens_modal.description_label', {amount: amount})}</Text>
                <NumberInput
                    {...form.getInputProps('amount')}
                    min={0}
                    max={amount}
                    label={t('withdraw_collateral_pool_tokens_modal.withdraw_amount_label')}
                    placeholder={t('withdraw_collateral_pool_tokens_modal.withdraw_amount_label')}
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
                        {t('withdraw_collateral_pool_tokens_modal.need_help_label')}
                    </Anchor>
                    <Button
                        type="submit"
                        loading={withdrawPool.isPending}
                        fw={400}
                    >
                        {t('withdraw_collateral_pool_tokens_modal.confirm_button')}
                    </Button>
                </Group>
            </form>
        </Modal>
)
}
