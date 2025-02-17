import React, { useState } from "react";
import { IconExclamationCircle } from "@tabler/icons-react";
import { Button, Divider, LoadingOverlay, Modal, NumberInput, rem, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useSafeFreeUnderlyingBalance, useWithdraw } from "@/api/underlying";
import { formatNumber, toNumber } from "@/utils";
import { modals } from "@mantine/modals";

interface IUnderlyingWithdrawalModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

interface IFormValues {
    address: string;
    amount: number | undefined;
}

export default function UnderlyingWithdrawalModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: IUnderlyingWithdrawalModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const safeFreeUnderlyingBalance = useSafeFreeUnderlyingBalance(fAssetSymbol, agentVaultAddress, opened);
    const withdraw = useWithdraw();
    const { t } = useTranslation();

    const maxWithdraw = toNumber(safeFreeUnderlyingBalance.data?.balance ?? '0');
    const nativeTokenName = fAssetSymbol.toLowerCase().match(/xrp|doge|btc/)![0].toUpperCase();
    const schema = yup.object().shape({
        address: yup.string().required(t('validation.messages.required', { field: t('underlying_withdrawal_modal.address_label') })),
        amount: yup.number()
            .required(t('validation.messages.required', { field: t('underlying_withdrawal_modal.amount_label', { token: nativeTokenName }) }))
            .min(1),
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            address: '',
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

    const onSubmit = async (amount: number, destinationAddress: string) => {
        try {
            await withdraw.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount,
                destinationAddress: destinationAddress
            });
            openSuccessModal();
        } catch (error: any) {
            if (error.message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('underlying_withdrawal_modal.error_message'));
            }
        }
    }

    const openSuccessModal = () => {
        handleOnClose();
        modals.open({
            title: t('underlying_withdrawal_modal.title'),
            children: (
                <>
                    <Text>
                        {t('underlying_withdrawal_modal.success_message')}
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
                            {t('underlying_withdrawal_modal.close_button')}
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
            title={t('underlying_withdrawal_modal.title')}
            size={600}
            centered
        >
            <LoadingOverlay visible={safeFreeUnderlyingBalance.isPending}/>
            <form
                onSubmit={form.onSubmit(form => onSubmit(form.amount, form.address))}
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
                <TextInput
                    {...form.getInputProps('address')}
                    key={form.key('address')}
                    label={t('underlying_withdrawal_modal.address_label')}
                    description={t('underlying_withdrawal_modal.address_description_label')}
                    className="mb-5"
                />
                <NumberInput
                    {...form.getInputProps('amount')}
                    key={form.key('amount')}
                    min={1}
                    max={maxWithdraw}
                    clampBehavior="strict"
                    label={t('underlying_withdrawal_modal.amount_label', { token: nativeTokenName })}
                    description={t('underlying_withdrawal_modal.amount_description_label', {
                        balance: formatNumber(safeFreeUnderlyingBalance.data?.balance ?? 0),
                        token: nativeTokenName
                    })}
                    classNames={{
                        section: 'w-auto'
                    }}
                    withAsterisk
                    rightSection={
                        <Button
                            variant="transparent"
                            size="sm"
                            className="pr-2 mt-1 underline"
                            fw={400}
                            //@ts-ignore
                            onClick={() => form.setFieldValue('amount', maxWithdraw) }
                        >
                            {t('underlying_withdrawal_modal.max_button')}
                        </Button>
                    }
                />
                <Text
                    fw={300}
                    className="mt-5"
                >
                    {t('underlying_withdrawal_modal.withdrawal_description_label')}
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
                <div className="flex justify-end mt-5">
                    <Button
                        type="submit"
                        fw={400}
                        loading={withdraw.isPending}
                    >
                        {t('underlying_withdrawal_modal.withdraw_button')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
