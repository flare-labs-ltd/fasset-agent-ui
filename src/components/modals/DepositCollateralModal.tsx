import {
    Modal,
    Group,
    Button,
    Anchor,
    TextInput,
    Text,
    Divider
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "mantine-form-yup-resolver";
import { modals } from "@mantine/modals";
import * as yup from "yup";
import { useDepositCollateral } from "@/api/agentVault";
import { useState } from "react";

interface IDepositCollateralModal {
    opened: boolean;
    vaultCollateralToken: string;
    fAssetSymbol: string;
    agentVaultAddress: string;
    onClose: () => void;
}

interface IFormValues {
    amount: number|undefined;
}

export default function DepositCollateralModal({ opened, vaultCollateralToken, fAssetSymbol, agentVaultAddress, onClose }: IDepositCollateralModal) {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
    const depositCollateral = useDepositCollateral();
    const { t } = useTranslation();

    const schema = yup.object().shape({
        amount: yup.number().required(t('validation.messages.required', { field: t('deposit_collateral_modal.deposit_amount_label', { vaultCollateralToken: vaultCollateralToken }) }))
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
            title: t('deposit_collateral_modal.title'),
            children: (
                <>
                    <Text>
                        {t('deposit_collateral_modal.success_message')}
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
                            { t('deposit_collateral_modal.close_button')}
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
            title: t('deposit_collateral_modal.title'),
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
                            { t('deposit_collateral_modal.close_button')}
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
            await depositCollateral.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                amount: amount
            });
            openSuccessModal();
        } catch (error) {
            if ((error as any).message) {
                openErrorModal((error as any).response.data.message);
            } else {
                openErrorModal(t('deposit_collateral_modal.error_message'));
            }
        }
    }

    return (
        <Modal
            opened={isModalVisible && opened}
            onClose={onClose}
            title={t('deposit_collateral_modal.title')}
            closeOnClickOutside={!depositCollateral.isPending}
            closeOnEscape={!depositCollateral.isPending}
            centered
        >
            <form onSubmit={form.onSubmit(form => onDepositCollateralSubmit(form.amount as number))}>
                <TextInput
                    {...form.getInputProps('amount')}
                    label={t('deposit_collateral_modal.deposit_amount_label', { vaultCollateralToken: vaultCollateralToken })}
                    description={t('deposit_collateral_modal.deposit_amount_description_label')}
                    placeholder={t('deposit_collateral_modal.deposit_amount_placeholder_label')}
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
                        {t('deposit_collateral_modal.need_help_label')}
                    </Anchor>
                    <Button
                        type="submit"
                        loading={depositCollateral.isPending}
                        fw={400}
                    >
                        {t('deposit_collateral_modal.confirm_button')}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
