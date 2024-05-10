import {
    TextInput,
    NumberInput,
    Divider,
    Select,
    Loader,
} from '@mantine/core';
import { useForm, Form } from '@mantine/form';
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
import { useRouter } from 'next/router';

interface IForm {
    disabled?: boolean;
    vault?: AgentVault;
}
interface ICollateralTemplate {
    fee: string;
    poolFeeShare: string;
    mintingVaultCollateralRatio: number;
    mintingPoolCollateralRatio: number;
    poolExitCollateralRatio: number;
    poolTopupCollateralRatio: number;
    poolTopupTokenPriceFactor: number;
    buyFAssetByAgentFactor: number;
}
type FormRef = {
    form: () => Form;
}

const VaultForm = forwardRef<FormRef, IForm>(({ vault, disabled }: IForm, ref) => {
    const [isHiddenInputDisabled, setIsHiddenInputDisabled] = useState<boolean>(true);
    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [fAssetTypes, SetfAssetTypes] = useState<string[]>([]);
    const [vaultCollateralTokens, setVaultCollateralTokens] = useState<string[]>([]);
    const [collateralTemplate, setCollateralTemplate] = useState<ICollateralTemplate|null>();
    const { t } = useTranslation();
    const vaultCollaterals = useVaultCollaterals();

    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;

    const schema = yup.object().shape({
        fAssetType: yup.string().required(t('validation.messages.required', { field: t('forms.vault.fasset_type_label') })),
        vaultCollateralToken: yup.string().required(t('validation.messages.required', { field: t('forms.vault.vault_collateral_token_label') })),
        poolTokenSuffix: yup.string().required(t('validation.messages.required', { field: t('forms.vault.pool_token_suffix_label') })),
        fee: yup.string().required(t('validation.messages.required', { field: t('forms.vault.minting_fee_label') })),
        poolFeeShare: yup.string().required(t('validation.messages.required', { field: t('forms.vault.pool_fee_share_label') })),
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
            fee: null,
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
            setIsHiddenInputDisabled(values.vaultCollateralToken === null);
            setIsHidden(values.fAssetType === null || values.vaultCollateralToken === null);
        }
    });

    useEffect(() => {
        const fAssetTypes = vaultCollaterals?.data?.map(item => item.fassetSymbol);
        if (fAssetTypes) {
            SetfAssetTypes(fAssetTypes);

            if (fAssetSymbol) {
                form.setFieldValue('fAssetType', fAssetSymbol);
            }
            if (agentVaultAddress) {
                const item = vaultCollaterals?.data?.find(item => item.fassetSymbol === fAssetSymbol);
                if (!item) return;
                setVaultCollateralTokens(item.collaterals.map(collateral => collateral.symbol));
                setIsHidden(false);
                if (vault) {
                    form.setValues({
                        vaultCollateralToken: vault.vaultCollateralToken
                    });
                }
            }
        }
    }, [vaultCollaterals.data]);
    useEffect(() => {
        if (!vault || vaultCollateralTokens.length === 0) return;
        form.setValues({
            vaultCollateralToken: vault.vaultCollateralToken
        });
    }, [vaultCollateralTokens]);
    useEffect(() => {
        if (!vault) return;

        form.setValues({
            name: agentVaultAddress,
            poolTokenSuffix: vault.poolSuffix,
            vaultCollateralToken: vault.vaultCollateralToken,
            fee: Number(vault.feeBIPS) / 100,
            poolFeeShare: Number(vault.poolFeeShareBIPS) / 100,
            mintingVaultCollateralRatio: Number(vault.mintingVaultCollateralRatioBIPS) / 10000,
            mintingPoolCollateralRatio: Number(vault.mintingPoolCollateralRatioBIPS) / 10000,
            poolExitCollateralRatio: Number(vault.poolExitCollateralRatioBIPS) / 10000,
            buyFAssetByAgentFactor: Number(vault.buyFAssetByAgentFactorBIPS) / 10000,
            poolTopUpCollateralRatio: Number(vault.poolTopupCollateralRatioBIPS) / 10000,
            poolTopUpTokenPriceFactor: Number(vault.poolTopupTokenPriceFactorBIPS) / 10000,
        });
    }, [vault]);
    useEffect(() => {
        if (vault || !collateralTemplate) return;
        form.setValues({
            fee: Number(collateralTemplate.fee.replace('%', '')),
            poolFeeShare: Number(collateralTemplate.poolFeeShare.replace('%', '')),
            mintingPoolCollateralRatio: Number(collateralTemplate.mintingPoolCollateralRatio),
            mintingVaultCollateralRatio: Number(collateralTemplate.mintingVaultCollateralRatio),
            poolExitCollateralRatio: Number(collateralTemplate.poolExitCollateralRatio),
            poolTopUpCollateralRatio: Number(collateralTemplate.poolTopupCollateralRatio),
            poolTopUpTokenPriceFactor: Number(collateralTemplate.poolTopupTokenPriceFactor),
            buyFAssetByAgentFactor: Number(collateralTemplate.buyFAssetByAgentFactor),
        });
    }, [collateralTemplate]);
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
            setVaultCollateralTokens(vault.collaterals.map(collateral => collateral.symbol));
        }
    }
    const onVaultCollateralTokenChange = (value: string, option: any) => {
        form.setValues({
            vaultCollateralToken: value
        });

        const item = vaultCollaterals.data?.find(item => item.fassetSymbol === form.getValues()['fAssetType']);
        if (item) {
            const collateral = item.collaterals.find(collateral => collateral.symbol === value);
            if (collateral) {
                setCollateralTemplate(JSON.parse(collateral.template));
            }
        }
    }

    return (
        <form className="w-full md:w-10/12">
            {agentVaultAddress &&
                <TextInput
                    {...form.getInputProps('name')}
                    label={t('forms.vault.address_label')}
                    description={t('forms.vault.address_description_label')}
                    placeholder={t('forms.vault.enter_placeholder')}
                    disabled={true}
                />
            }
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
                onChange={(value, option) => onVaultCollateralTokenChange(value, option)}
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
            {!isHidden &&
                <>
                    <Divider
                        my="xl"
                    />
                    <TextInput
                        {...form.getInputProps('poolTokenSuffix')}
                        label={t('forms.vault.pool_token_suffix_label')}
                        description={t('forms.vault.pool_token_suffix_description_label')}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        disabled={isHiddenInputDisabled || vault != null}
                    />
                    <NumberInput
                        {...form.getInputProps('fee')}
                        label={t('forms.vault.minting_fee_label')}
                        description={t('forms.vault.minting_fee_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={0.1}
                        suffix="%"
                        className="mt-4"
                    />
                    <NumberInput
                        {...form.getInputProps('poolFeeShare')}
                        label={t('forms.vault.pool_fee_share_label')}
                        description={t('forms.vault.pool_fee_share_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={1}
                        suffix="%"
                        className="mt-4"
                    />
                    <NumberInput
                        {...form.getInputProps('mintingVaultCollateralRatio')}
                        label={t('forms.vault.minting_vault_collateral_ratio_label')}
                        description={t('forms.vault.minting_vault_collateral_ratio_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={0.01}
                        className="mt-4"
                    />
                    <NumberInput
                        {...form.getInputProps('mintingPoolCollateralRatio')}
                        label={t('forms.vault.minting_pool_collateral_ratio_label')}
                        description={t('forms.vault.minting_pool_collateral_ratio_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={0.1}
                        className="mt-4"
                    />
                    <NumberInput
                        {...form.getInputProps('poolExitCollateralRatio')}
                        label={t('forms.vault.pool_exit_collateral_ratio_label')}
                        description={t('forms.vault.pool_exit_collateral_ratio_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={0.1}
                        className="mt-4"
                    />
                    <NumberInput
                        {...form.getInputProps('buyFAssetByAgentFactor')}
                        label={t('forms.vault.buy_fasset_by_agent_factor_label')}
                        description={t('forms.vault.buy_fasset_by_agent_factor_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={0.1}
                        className="mt-4"
                    />
                    <NumberInput
                        {...form.getInputProps('poolTopUpCollateralRatio')}
                        label={t('forms.vault.pool_top_up_collateral_ratio_label')}
                        description={t('forms.vault.pool_top_up_collateral_ratio_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={0.1}
                        className="mt-4"
                    />
                    <NumberInput
                        {...form.getInputProps('poolTopUpTokenPriceFactor')}
                        label={t('forms.vault.pool_top_up_token_price_factor_label')}
                        description={t('forms.vault.pool_top_up_token_price_factor_description_label')}
                        disabled={isHiddenInputDisabled || disabled}
                        placeholder={t('forms.vault.enter_placeholder')}
                        withAsterisk
                        allowNegative={false}
                        step={0.1}
                        className="mt-4"
                    />
                </>
            }
        </form>
    )
});

export default VaultForm;
