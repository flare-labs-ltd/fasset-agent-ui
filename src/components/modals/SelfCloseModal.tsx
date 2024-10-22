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
import { useBackedAmount } from "@/api/agentVault";
import { useSelfClose } from "@/api/agent";

interface ISelfCloseModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

interface IFormValues {
    amount: number|undefined;
}

export default function SelfCloseModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: ISelfCloseModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const backedAmount = useBackedAmount(fAssetSymbol, agentVaultAddress, opened);
    const selfClose = useSelfClose();
    const { t } = useTranslation();

    const amount = toNumber(backedAmount?.data?.data?.balance ?? '0');
    const schema = yup.object().shape({
        amount: yup.number()
            .required(t('validation.messages.required', { field: t('self_close_modal.withdraw_amount_label') }))
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

    const onSelfCloseClick = async (amount: number) => {
        try {
            await selfClose.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount
            });
            openSuccessModal();
        } catch (error: any) {
            if ((error as any).message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('self_close_modal.error_message'));
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
            title: t('self_close_modal.title'),
            children: (
                <>
                    <Text>
                        {t('self_close_modal.success_message')}
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
                            { t('self_close_modal.close_button')}
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
            title={t('self_close_modal.title')}
            closeOnClickOutside={!selfClose.isPending}
            closeOnEscape={!selfClose.isPending}
            centered
        >
            <LoadingOverlay visible={backedAmount.isPending} />
            <form onSubmit={form.onSubmit(form => onSelfCloseClick(form.amount as number))}>
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
                <Text>{t('self_close_modal.description_label', { amount: amount, fAssetSymbol: fAssetSymbol })}</Text>
                <NumberInput
                    {...form.getInputProps('amount')}
                    min={0}
                    max={amount}
                    label={t('self_close_modal.withdraw_amount_label')}
                    placeholder={t('self_close_modal.withdraw_amount_label')}
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
                        {t('self_close_modal.need_help_label')}
                    </Anchor>
                    <Button
                        type="submit"
                        loading={selfClose.isPending}
                        fw={400}
                    >
                        {t('self_close_modal.confirm_button')}
                    </Button>
                </Group>
            </form>
        </Modal>
    )
}
