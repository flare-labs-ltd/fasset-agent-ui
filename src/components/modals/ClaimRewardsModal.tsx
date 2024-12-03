import { useState } from "react";
import {
    Modal,
    NumberInput,
    LoadingOverlay,
    Divider,
    Button,
    Text,
    rem
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconExclamationCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { useFeeBalance, useFeeWithdraw } from "@/api/poolCollateral";
import { yupResolver } from "mantine-form-yup-resolver";
import { toNumber } from "@/utils";

interface IClaimRewardsModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

interface IFormValues {
    amount: number | undefined;
}

export default function ClaimRewardsModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: IClaimRewardsModal) {
    const [errorMessage, setErrorMessage] = useState<string>();

    const { t } = useTranslation();
    const feeBalance = useFeeBalance(fAssetSymbol, agentVaultAddress, opened);
    const feeWithdraw = useFeeWithdraw();

    const schema = yup.object().shape({
        amount: yup
            .number()
            .required(t('validation.messages.required', { field: t('claim_rewards_modal.form.amount_label', { fAssetSymbol: fAssetSymbol}) }))
            .min(0),
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            amount: undefined
        },
        //@ts-ignore
        validate: yupResolver(schema)
    });

    const openSuccessModal = () => {
        handleOnClose();
        modals.open({
            title: t('claim_rewards_modal.title'),
            children: (
                <>
                    <Text>
                        {t('claim_rewards_modal.success_message')}
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
                            {t('claim_rewards_modal.close_button')}
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

    const onSubmit = async (amount: number) => {
        try {
            await feeWithdraw.mutateAsync({ fAssetSymbol, agentVaultAddress, amount });
            openSuccessModal();
        } catch (error: any) {
            if (error.message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('claim_rewards_modal.error_message'));
            }
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={handleOnClose}
            title={t('claim_rewards_modal.title')}
            closeOnClickOutside={true}
            closeOnEscape={true}
            centered
            size={540}
        >
            <LoadingOverlay visible={feeBalance.isPending} />
            <form onSubmit={form.onSubmit(form => onSubmit(form.amount as number))}>
                {errorMessage &&
                    <div className="flex items-center mb-5 border border-red-700 p-3 bg-red-100">
                        <IconExclamationCircle
                            style={{ width: rem(25), height: rem(25) }}
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
                    min={0}
                    max={feeBalance.isPending ? 0 : toNumber(feeBalance.data?.balance!)}
                    clampBehavior="strict"
                    label={t('claim_rewards_modal.form.amount_label', { fAssetSymbol: fAssetSymbol })}
                    description={t('claim_rewards_modal.form.amount_description_label', {
                        amount: feeBalance.isPending ? 0 : feeBalance.data?.balance!,
                        fAssetSymbol: fAssetSymbol
                    })}
                    placeholder={t('claim_rewards_modal.form.amount_placeholder_label')}
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
                <div className="flex justify-end mt-5">
                    <Button
                        type="submit"
                        fw={400}
                        loading={feeWithdraw.isPending}
                    >
                        {t('claim_rewards_modal.submit_button')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
