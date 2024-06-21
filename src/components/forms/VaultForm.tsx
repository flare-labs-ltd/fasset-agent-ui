import {
    TextInput,
    NumberInput,
    Divider,
    Select,
    Loader
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useVaultCollaterals } from "@/api/agent";
import { IAgentVault } from "@/types";
import { useRouter } from "next/router";
import CopyIcon from "@/components/icons/CopyIcon";

interface IForm {
    disabled?: boolean;
    vault?: IAgentVault;
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
interface IFormValues {
    name: string|undefined;
    fAssetType: string|undefined|null;
    vaultCollateralToken: string|undefined|null;
    poolTokenSuffix: string|undefined;
    fee: number|undefined;
    poolFeeShare: number|undefined;
    mintingVaultCollateralRatio: number|undefined;
    mintingPoolCollateralRatio: number|undefined;
    poolExitCollateralRatio: number|undefined;
    buyFAssetByAgentFactor: number|undefined;
    poolTopUpCollateralRatio: number|undefined;
    poolTopUpTokenPriceFactor: number|undefined;
}
export type FormRef = {
    form: () => UseFormReturnType<any>;
}

const POOL_TOKEN_SUFFIX_MAX_LENGTH = 20;

const VaultForm = forwardRef<FormRef, IForm>(({ vault, disabled }: IForm, ref) => {
    const [isHiddenInputDisabled, setIsHiddenInputDisabled] = useState<boolean>(true);
    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [fAssetTypes, SetfAssetTypes] = useState<string[]>([]);
    const [vaultCollateralTokens, setVaultCollateralTokens] = useState<string[]>([]);
    const [collateralTemplate, setCollateralTemplate] = useState<ICollateralTemplate|null>();
    const [poolTokenSuffixCharCount, setPoolTokenSuffixCharCount] = useState<number>(0);
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
        mintingVaultCollateralRatio: yup.string().required(t('validation.messages.required', { field: t('forms.vault.minting_vault_collateral_ratio_label') })),
        mintingPoolCollateralRatio: yup.string().required(t('validation.messages.required', { field: t('forms.vault.minting_pool_collateral_ratio_label') })),
        poolExitCollateralRatio: yup.string().required(t('validation.messages.required', { field: t('forms.vault.pool_exit_collateral_ratio_label') })),
        buyFAssetByAgentFactor: yup.string().required(t('validation.messages.required', { field: t('forms.vault.buy_fasset_by_agent_factor_label') })),
        poolTopUpCollateralRatio: yup.string().required(t('validation.messages.required', { field: t('forms.vault.pool_top_up_collateral_ratio_label') })),
        poolTopUpTokenPriceFactor: yup.string().required(t('validation.messages.required', { field: t('forms.vault.pool_top_up_token_price_factor_label') })),
    });

    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            fAssetType: undefined,
            vaultCollateralToken: undefined,
            poolTokenSuffix: '',
            fee: undefined,
            poolFeeShare: undefined,
            mintingVaultCollateralRatio: undefined,
            mintingPoolCollateralRatio: undefined,
            poolExitCollateralRatio: undefined,
            buyFAssetByAgentFactor: undefined,
            poolTopUpCollateralRatio: undefined,
            poolTopUpTokenPriceFactor: undefined,
        },
        //@ts-ignore
        validate: yupResolver(schema),
        onValuesChange: (values) => {
            setIsHiddenInputDisabled(values.vaultCollateralToken === null);
            setIsHidden(values.fAssetType === undefined || values.vaultCollateralToken === undefined);
            setPoolTokenSuffixCharCount(values.poolTokenSuffix ? values.poolTokenSuffix.length : 0);
        }
    });

    useEffect(() => {
        const fAssetTypes = vaultCollaterals?.data?.map(item => item.fassetSymbol);
        if (fAssetTypes) {
            SetfAssetTypes(fAssetTypes);

            if (fAssetSymbol) {
                form.setFieldValue('fAssetType', fAssetSymbol as string);
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
            name: agentVaultAddress as string,
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

    const onFAssetTypeChange = (value: string|null, option: any) => {
        form.setValues({
            fAssetType: value
        });
        const vault = vaultCollaterals.data?.find(item => item.fassetSymbol === value);
        if (vault) {
            setVaultCollateralTokens(vault.collaterals.map(collateral => collateral.symbol));
        }
    }
    const onVaultCollateralTokenChange = (value: string|null, option: any) => {
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
        <form>
            {agentVaultAddress &&
                <TextInput
                    {...form.getInputProps('name')}
                    //@ts-ignore
                    key={form.key('name')}
                    label={t('forms.vault.address_label')}
                    description={t('forms.vault.address_description_label')}
                    placeholder={t('forms.vault.enter_placeholder')}
                    disabled={true}
                    rightSection={<CopyIcon text={agentVaultAddress as string} />}
                />
            }
            <Select
                {...form.getInputProps('fAssetType')}
                //@ts-ignore
                key={form.key('fAssetType')}
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
                allowDeselect={false}
            />
            <Select
                {...form.getInputProps('vaultCollateralToken')}
                //@ts-ignore
                key={form.key('vaultCollateralToken')}
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
                className="mt-4 font-normal"
                disabled={disabled || vault != null}
                allowDeselect={false}
            />
            {!isHidden &&
                <>
                    <Divider
                        my="xl"
                    />
                    <div>
                        <TextInput
                            {...form.getInputProps('poolTokenSuffix')}
                            //@ts-ignore
                            key={form.key('poolTokenSuffix')}
                            label={t('forms.vault.pool_token_suffix_label')}
                            description={t('forms.vault.pool_token_suffix_description_label')}
                            placeholder={t('forms.vault.enter_placeholder')}
                            maxLength={20}
                            withAsterisk
                            disabled={isHiddenInputDisabled || vault != null}
                            rightSection={<div className="text-xs">{poolTokenSuffixCharCount}/{POOL_TOKEN_SUFFIX_MAX_LENGTH}</div>}
                        />

                    </div>
                    <NumberInput
                        {...form.getInputProps('fee')}
                        //@ts-ignore
                        key={form.key('fee')}
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
                        //@ts-ignore
                        key={form.key('poolFeeShare')}
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
                        //@ts-ignore
                        key={form.key('mintingVaultCollateralRatio')}
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
                        //@ts-ignore
                        key={form.key('mintingPoolCollateralRatio')}
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
                        //@ts-ignore
                        key={form.key('poolExitCollateralRatio')}
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
                        //@ts-ignore
                        key={form.key('buyFAssetByAgentFactor')}
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
                        //@ts-ignore
                        key={form.key('poolTopUpCollateralRatio')}
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
                        //@ts-ignore
                        key={form.key('poolTopUpTokenPriceFactor')}
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

VaultForm.displayName = 'VaultForm';
export default VaultForm;
