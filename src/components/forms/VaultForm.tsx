import {
    TextInput,
    Divider,
    Select,
    Loader,
    LoadingOverlay,
    rem
} from '@mantine/core';
import { useForm, Form } from '@mantine/form';
import { IconPercentage } from '@tabler/icons-react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useVaultCollaterals } from '@/api/agent';
import { AgentVault } from '@/types';

interface IForm {
    loading?: boolean,
    disabled?: boolean,
    vault?: AgentVault
}
type FormRef = {
    form: () => Form;
}

const VaultForm = forwardRef<FormRef, IForm>(({ vault, loading, disabled }: IForm, ref) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [fAssetTypes, SetfAssetTypes] = useState<string[]>([]);
    const [vaultCollateralTokens, setVaultCollateralTokens] = useState<string[]>([]);
    const { t } = useTranslation();
    const vaultCollaterals = useVaultCollaterals();

    const schema = yup.object().shape({
        name: yup.string().required(t('validation.messages.required', { field: t('forms.vault.name_label') })),
        fAssetType: yup.string().required(t('validation.messages.required', { field: t('forms.vault.fasset_type_label') })),
        vaultCollateralToken: yup.string().required(t('validation.messages.required', { field: t('forms.vault.vault_collateral_token_label') })),
        poolTokenSuffix: yup.string().required(t('validation.messages.required', { field: t('forms.vault.pool_token_suffix_label') })),
        mintingFee: yup.number().required(t('validation.messages.required', { field: t('forms.vault.minting_fee_label') })),
        poolFeeShare: yup.number().required(t('validation.messages.required', { field: t('forms.vault.pool_fee_share_label') })),
        mintingVaultCollateralRatio: yup.number().required(t('validation.messages.required', { field: t('forms.vault.minting_vault_collateral_ratio_label') })),
        mintingPoolCollateralRatio: yup.number().required(t('validation.messages.required', { field: t('forms.vault.minting_pool_collateral_ratio_label') })),
        poolExitCollateralRatio: yup.number().required(t('validation.messages.required', { field: t('forms.vault.pool_exit_collateral_ratio_label') })),
        buyFAssetByAgentFactor: yup.number().required(t('validation.messages.required', { field: t('forms.vault.buy_fasset_by_agent_factor_label') })),
        poolTopUpCollateralRatio: yup.number().required(t('validation.messages.required', { field: t('forms.vault.pool_top_up_collateral_ratio_label') })),
        poolTopUpTokenPriceFactor: yup.number().required(t('validation.messages.required', { field: t('forms.vault.pool_top_up_token_price_factor_label') })),
    });
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: null,
            fAssetType: null,
            vaultCollateralToken: null,
            poolTokenSuffix: null,
            mintingFee: null,
            poolFeeShare: null,
            mintingVaultCollateralRatio: null,
            mintingPoolCollateralRatio: null,
            poolExitCollateralRatio: null,
            buyFAssetByAgentFactor: null,
            poolTopUpCollateralRatio: null,
            poolTopUpTokenPriceFactor: null,
        },
        validate: yupResolver(schema),
        onValuesChange: (values) => {
            setIsDisabled( values.name === null || values.fAssetType === null || values.vaultCollateralToken === null);
        }
    });

    useEffect(() => {
        const fAssetTypes = vaultCollaterals?.data?.map(item => item.fassetSymbol);
        if (fAssetTypes) {
            SetfAssetTypes(fAssetTypes);
        }

    }, [vaultCollaterals.data]);
    useEffect(() => {
        if (!vault) return;

        form.setValues({
            name: null,
            fAssetType: null,
            vaultCollateralToken: null,
            poolTokenSuffix: null,
            mintingFee: Number(vault.feeBIPS) / 100,
            poolFeeShare: Number(vault.poolFeeShareBIPS) / 100,
            mintingVaultCollateralRatio: Number(vault.mintingVaultCollateralRatioBIPS) / 10000,
            mintingPoolCollateralRatio: Number(vault.mintingPoolCollateralRatioBIPS) / 10000,
            poolExitCollateralRatio: Number(vault.poolExitCollateralRatioBIPS) / 10000,
            buyFAssetByAgentFactor: Number(vault.buyFAssetByAgentFactorBIPS) / 10000,
            poolTopUpCollateralRatio: Number(vault.poolTopupCollateralRatioBIPS) / 10000,
            poolTopUpTokenPriceFactor: Number(vault.poolTopupTokenPriceFactorBIPS) / 10000,
        });
    }, [vault]);
    useImperativeHandle(ref, () => ({
        form: () => {
            return form;
        }
    }));

    const onFAssetTypeChange = (value: string, option: any) => {
        form.setValues({
            fAssetType: value
        });
        const vault = vaultCollaterals.data?.find(item => item.fassetSymbol === value);
        if (vault) {
            setVaultCollateralTokens(vault.collaterals);
        }
    }

    return (
        <form className="w-full md:w-10/12 relative">
            <LoadingOverlay visible={loading} />
            <TextInput
                {...form.getInputProps('name')}
                label={t('forms.vault.name_label')}
                description={t('forms.vault.name_description_label')}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                disabled={disabled || vault != null}
            />
            <Select
                {...form.getInputProps('fAssetType')}
                data={fAssetTypes}
                onChange={(value, option) => onFAssetTypeChange(value, option)}
                label={t('forms.vault.fasset_type_label')}
                description={t('forms.vault.fasset_type_description_label')}
                placeholder={t('forms.vault.fasset_type_placeholder')}
                withAsterisk
                rightSection={
                    vaultCollaterals.isPending
                        ? <Loader size="xs" />
                        : ''
                }
                className="mt-4"
                disabled={disabled || vault != null}
            />
            <Select
                {...form.getInputProps('vaultCollateralToken')}
                data={vaultCollateralTokens}
                label={t('forms.vault.vault_collateral_token_label')}
                description={t('forms.vault.vault_collateral_token_description_label')}
                placeholder={t('forms.vault.vault_collateral_token_placeholder')}
                withAsterisk
                rightSection={
                    vaultCollaterals.isPending
                        ? <Loader size="xs" />
                        : ''
                }
                className="mt-4"
                disabled={disabled || vault != null}
            />
            <Divider
                my="xl"
            />
            <TextInput
                {...form.getInputProps('poolTokenSuffix')}
                label={t('forms.vault.pool_token_suffix_label')}
                description={t('forms.vault.pool_token_suffix_description_label')}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                disabled={isDisabled || vault != null}
            />
            <TextInput
                {...form.getInputProps('mintingFee')}
                label={t('forms.vault.minting_fee_label')}
                description={t('forms.vault.minting_fee_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                rightSectionPointerEvents="none"
                rightSection={<IconPercentage style={{ width: rem(20), height: rem(20) }} />}
                className="mt-4"
            />
            <TextInput
                {...form.getInputProps('poolFeeShare')}
                label={t('forms.vault.pool_fee_share_label')}
                description={t('forms.vault.pool_fee_share_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                rightSectionPointerEvents="none"
                rightSection={<IconPercentage style={{ width: rem(20), height: rem(20) }} />}
                className="mt-4"
            />
            <TextInput
                {...form.getInputProps('mintingVaultCollateralRatio')}
                label={t('forms.vault.minting_vault_collateral_ratio_label')}
                description={t('forms.vault.minting_vault_collateral_ratio_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                className="mt-4"
            />
            <TextInput
                {...form.getInputProps('mintingPoolCollateralRatio')}
                label={t('forms.vault.minting_pool_collateral_ratio_label')}
                description={t('forms.vault.minting_pool_collateral_ratio_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                className="mt-4"
            />
            <TextInput
                {...form.getInputProps('poolExitCollateralRatio')}
                label={t('forms.vault.pool_exit_collateral_ratio_label')}
                description={t('forms.vault.pool_exit_collateral_ratio_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                className="mt-4"
            />
            <TextInput
                {...form.getInputProps('buyFAssetByAgentFactor')}
                label={t('forms.vault.buy_fasset_by_agent_factor_label')}
                description={t('forms.vault.buy_fasset_by_agent_factor_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                className="mt-4"
            />
            <TextInput
                {...form.getInputProps('poolTopUpCollateralRatio')}
                label={t('forms.vault.pool_top_up_collateral_ratio_label')}
                description={t('forms.vault.pool_top_up_collateral_ratio_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                className="mt-4"
            />
            <TextInput
                {...form.getInputProps('poolTopUpTokenPriceFactor')}
                label={t('forms.vault.pool_top_up_token_price_factor_label')}
                description={t('forms.vault.pool_top_up_token_price_factor_description_label')}
                disabled={isDisabled}
                placeholder={t('forms.vault.enter_placeholder')}
                withAsterisk
                className="mt-4"
            />
        </form>
    )
});

export default VaultForm;
