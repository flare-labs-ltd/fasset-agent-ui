import {
    Modal,
    Group,
    Button,
    Anchor,
    Text,
    Divider,
    rem,
    NumberInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useDepositFLRInPool } from "@/api/poolCollateral";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { ICollateralItem } from "@/types";
import { toNumber } from "@/utils";
import { IconExclamationCircle } from "@tabler/icons-react";

interface IDepositPoolCollateralModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
    collateral: UseQueryResult<ICollateralItem[], Error>;
}

interface IFormValues {
    amount: number | undefined;
}

export default function DepositPoolCollateralModal({ opened, onClose, fAssetSymbol, agentVaultAddress, collateral }: IDepositPoolCollateralModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const depositFLR = useDepositFLRInPool();
    const { t } = useTranslation();

    const amount = toNumber((collateral?.data || []).find(c => c.symbol.toLowerCase() === 'flr' || c.symbol.toLowerCase() === 'cflr')?.balance || '0');
    const schema = yup.object().shape({
        amount: yup.number()
        .required(t('validation.messages.required', { field: t('deposit_flr_in_pool.deposit_amount_label', { vaultCollateralToken: 'FLR' }) }))
        .max(amount, t('validation.custom_messages.balance_to_low'))
        .min(1)
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
        handleOnClose();
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

    const handleOnClose = () => {
        setErrorMessage(undefined);
        form.reset();
        onClose();
    }

    const onDepositCollateralSubmit = async(amount: number) => {
        const status = form.validate();
        if (status.hasErrors) return;
        
        setErrorMessage(undefined);

        try {
            await depositFLR.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount
            });
            openSuccessModal();
        } catch (error) {
            if ((error as any).message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('deposit_flr_in_pool.error_message'));
            }
        }
    }
    return (
        <Modal
            opened={opened}
            onClose={handleOnClose}
            title={t('deposit_flr_in_pool.title')}
            closeOnClickOutside={!depositFLR.isPending}
            closeOnEscape={!depositFLR.isPending}
            centered
        >
            <form onSubmit={form.onSubmit(form => onDepositCollateralSubmit(form.amount as number))}>
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
                
                <NumberInput
                    {...form.getInputProps('amount')}
                    decimalScale={3}
                    min={0}
                    label={t('deposit_flr_in_pool.deposit_amount_label', { vaultCollateralToken: 'FLR' })}
                    description={t('deposit_flr_in_pool.deposit_amount_description_label', {amount: amount, token: 'FLR'})}
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
                        href="https://docs.flare.network/infra/fassets/agent/"
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
