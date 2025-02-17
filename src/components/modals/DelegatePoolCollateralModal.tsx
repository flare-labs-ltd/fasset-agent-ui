import { useEffect, useState } from "react";
import {
    Modal,
    TextInput,
    Slider,
    NumberInput,
    Divider,
    Button,
    rem,
    Text
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { IconExclamationCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useDelegateAll, useUndelegate } from "@/api/poolCollateral";

interface IDelegatePoolCollateralModal {
    opened: boolean;
    onClose: (refetch: boolean) => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
    delegates: {
        address: string;
        delegation: string;
    }[];
}

interface IFormValues {
    mainAddress: string;
}

export default function DelegatePoolCollateralModal({ opened, onClose, fAssetSymbol, agentVaultAddress, delegates }: IDelegatePoolCollateralModal) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [secondAddress, setSecondAddress] = useState<string>();
    const [mainAddressBips, setMainAddressBips] = useState<number>(0);
    const [secondAddressBips, setSecondAddressBips] = useState<number>(0);

    const { t } = useTranslation();
    const delegateAll = useDelegateAll();
    const undelegate = useUndelegate();

    const schema = yup.object().shape({
        mainAddress: yup.string()
            .required(t('validation.messages.required', { field: t('delegate_pool_collateral_modal.form.main_address_label') }))
    });
    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            mainAddress: ''
        },
        //@ts-ignore
        validate: yupResolver(schema),
    });

    const hasDelegation = delegates.length > 0;

    useEffect(() => {
        if (delegates.length === 0) return;

        form.setFieldValue('mainAddress', delegates[0].address);
        setMainAddressBips(parseInt(delegates[0].delegation));

        if (delegates.length > 1) {
            setSecondAddress(delegates[1].address);
            setSecondAddressBips(parseInt(delegates[1].delegation));
        }
    }, [delegates]);

    const handleOnClose = (refetch: boolean = false) => {
        setErrorMessage(undefined);
        form.reset();
        setSecondAddress(undefined);
        setMainAddressBips(0);
        setSecondAddressBips(0);
        onClose(refetch);
    }

    const onDelegate = async () => {
        const status = await form.validate();
        if (status.hasErrors) return;

        const values = form.getValues();
        const payload = [{
            address: values.mainAddress,
            bips: mainAddressBips * 100
        }];

        if (secondAddress) {
            payload.push({
                address: secondAddress,
                bips: secondAddressBips * 100
            })
        }

        try {
            await delegateAll.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                payload: payload
            });
            openSuccessModal();
        } catch (error: any) {
            if ((error as any).message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('delegate_pool_collateral_modal.delegate_error_message'));
            }
        }
    }
    
    const onUndelegate = async () => {
        try {
            modals.closeAll();
            await undelegate.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
            });
            openSuccessModal(false);
        } catch (error: any) {
            if ((error as any).message) {
                setErrorMessage((error as any).response.data.message);
            } else {
                setErrorMessage(t('delegate_pool_collateral_modal.undelegate_error_message'));
            }
        }
    }

    const openConfirmModal = () => {
        modals.open({
            title: t('delegate_pool_collateral_modal.title'),
            centered: true,
            children: (
                <>
                    <Text size="sm">
                        {t('delegate_pool_collateral_modal.delete_confirmation_label')}
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
                    <div className="flex justify-end">
                        <Button
                            onClick={onUndelegate}
                            radius="xl"
                        >
                            {t('delegate_pool_collateral_modal.undelegate_button')}
                        </Button>
                    </div>
                </>
            )
        });
    }

    const openSuccessModal = (isDelegation: boolean = true) => {
        handleOnClose(true);
        modals.open({
            title: t('delegate_pool_collateral_modal.title'),
            children: (
                <>
                    <Text>
                        {t(`delegate_pool_collateral_modal.${isDelegation ? 'delegate_success_message' : 'undelegate_success_message'}`)}
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
                            { t('delegate_pool_collateral_modal.close_button')}
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
            size={540}
            title={t('delegate_pool_collateral_modal.title')}
            centered
        >
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
            <TextInput
                {...form.getInputProps('mainAddress')}
                //@ts-ignore
                key={form.key('mainAddress')}
                label={t('delegate_pool_collateral_modal.form.main_address_label')}
                description={t('delegate_pool_collateral_modal.form.main_address_description_label')}
                placeholder={t('delegate_pool_collateral_modal.form.main_address_placeholder_label')}
            />
            <div className="flex items-center justify-between mt-3">
                <Slider
                    value={mainAddressBips}
                    onChange={setMainAddressBips}
                    color="var(--flr-black)"
                    marks={[
                        { value: 25, label: '25%' },
                        { value: 50, label: '50%' },
                        { value: 75, label: '75%' },
                    ]}
                    className="grow basis-3/4 mr-3"
                />
                <NumberInput
                    value={mainAddressBips}
                    onChange={(value) => setMainAddressBips(value as number)}
                    suffix="%"
                    className="basis-1/4"
                />
            </div>
            <TextInput
                value={secondAddress}
                onChange={(event) => setSecondAddress(event.currentTarget.value)}
                label={t('delegate_pool_collateral_modal.form.second_address_label')}
                description={t('delegate_pool_collateral_modal.form.second_address_description_label')}
                placeholder={t('delegate_pool_collateral_modal.form.second_address_placeholder_label')}
                className="mt-10"
            />
            <div className="flex items-center justify-between mt-3">
                <Slider
                    value={secondAddressBips}
                    onChange={setSecondAddressBips}
                    color="var(--flr-black)"
                    marks={[
                        { value: 25, label: '25%' },
                        { value: 50, label: '50%' },
                        { value: 75, label: '75%' },
                    ]}
                    className="grow basis-3/4 mr-3"
                />
                <NumberInput
                    value={secondAddressBips}
                    onChange={(value) => setSecondAddressBips(value as number)}
                    suffix="%"
                    className="basis-1/4"
                />
            </div>
            <Divider
                className="my-8"
                styles={{
                    root: {
                        marginLeft: '-2rem',
                        marginRight: '-2rem'
                    }
                }}
            />
            <div className="flex justify-end">
                <Button
                    fw={400}
                    onClick={onDelegate}
                    loading={undelegate.isPending || delegateAll.isPending}
                >
                    {t(`delegate_pool_collateral_modal.${hasDelegation ? 'redelegate_button' : 'delegate_button'}`)}
                </Button>
                {hasDelegation &&
                    <Button
                        fw={400}
                        onClick={openConfirmModal}
                        loading={undelegate.isPending || delegateAll.isPending}
                        className="ml-3"
                    >
                        {t('delegate_pool_collateral_modal.undelegate_button')}
                    </Button>
                }
            </div>
        </Modal>
    );
}
