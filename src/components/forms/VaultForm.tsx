import {
    TextInput,
    NumberInput,
    Divider,
    Select,
    Loader,
    Text
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useVaultCollaterals } from "@/api/agent";
import { IAgentVault } from "@/types";
import { useRouter } from "next/router";
import CopyIcon from "@/components/icons/CopyIcon";
import { MIN_CREATE_VAULT_BALANCE } from "@/constants";

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
    name: string | undefined;
    fAssetType: string | undefined | null;
    vaultCollateralToken: string | undefined | null;
    poolTokenSuffix: string | undefined;
    fee: number | undefined;
    poolFeeShare: number | undefined;
    redemptionPoolFeeShareBIPS: number | undefined;
    mintingVaultCollateralRatio: number | undefined;
    mintingPoolCollateralRatio: number | undefined;
    poolExitCollateralRatio: number | undefined;
    buyFAssetByAgentFactor: number | undefined;
    poolTopUpCollateralRatio: number | undefined;
    poolTopUpTokenPriceFactor: number | undefined;
    handshakeType: string | undefined | null;
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
    const [minAmountDescriptionLabel, setMinAmountDescriptionLabel] = useState<string>();
    const [faucetUrl, setFaucetUrl] = useState<string>();
    const [minAmount, setMinAmount] = useState<number>();
    const { t } = useTranslation();
    const vaultCollaterals = useVaultCollaterals();

    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;

    const getSchema = (vault: IAgentVault | undefined) => {
        let schema = yup.object().shape({
            fAssetType: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.fasset_type_label') })),
            vaultCollateralToken: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.vault_collateral_token_label') })),
            poolTokenSuffix: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.pool_token_suffix_label') })),
            fee: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.minting_fee_label') })),
            poolFeeShare: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.pool_fee_share_label') })),
            mintingVaultCollateralRatio: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.minting_vault_collateral_ratio_label') })),
            mintingPoolCollateralRatio: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.minting_pool_collateral_ratio_label') })),
            poolExitCollateralRatio: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.pool_exit_collateral_ratio_label') })),
            buyFAssetByAgentFactor: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.buy_fasset_by_agent_factor_label') })),
            poolTopUpCollateralRatio: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.pool_top_up_collateral_ratio_label') })),
            poolTopUpTokenPriceFactor: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.pool_top_up_token_price_factor_label') })),
            handshakeType: yup
                .string()
                .required(t('validation.messages.required', { field: t('forms.vault.handshake_type_label') })),
        });

        if (vault) {
            schema = schema.shape({
                redemptionPoolFeeShareBIPS: yup
                    .string()
                    .required(
                        t('validation.messages.required', { field: t('forms.vault.redemption_pool_fee_share_label') })
                    ),
            });
        }

        return schema;
    }

    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            fAssetType: undefined,
            vaultCollateralToken: undefined,
            poolTokenSuffix: '',
            fee: undefined,
            poolFeeShare: undefined,
            redemptionPoolFeeShareBIPS: undefined,
            mintingVaultCollateralRatio: undefined,
            mintingPoolCollateralRatio: undefined,
            poolExitCollateralRatio: undefined,
            buyFAssetByAgentFactor: undefined,
            poolTopUpCollateralRatio: undefined,
            poolTopUpTokenPriceFactor: undefined,
            handshakeType: undefined
        },
        //@ts-ignore
        validate: yupResolver(getSchema(vault)),
        onValuesChange: (values, previousValues) => {
            setIsHiddenInputDisabled(values.vaultCollateralToken === null);
            setIsHidden(values.fAssetType === undefined || values.vaultCollateralToken === undefined);
            setPoolTokenSuffixCharCount(values.poolTokenSuffix ? values.poolTokenSuffix.length : 0);

            if (values.fAssetType !== undefined) {
                if (values.fAssetType!.toLowerCase() === 'ftestxrp') {
                    setMinAmountDescriptionLabel('forms.vault.xrp_min_amount_description_label');
                    setMinAmount(MIN_CREATE_VAULT_BALANCE.XRP);
                    setFaucetUrl('https://test.bithomp.com/faucet');
                } else if (values.fAssetType!.toLowerCase() === 'ftestbtc') {
                    setMinAmountDescriptionLabel('forms.vault.btc_min_amount_description_label');
                    setMinAmount(MIN_CREATE_VAULT_BALANCE.BTC);
                    setFaucetUrl('https://bitcoinfaucet.uo1.net/');
                } else if (values.fAssetType!.toLowerCase() === 'ftestdoge') {
                    setMinAmountDescriptionLabel('forms.vault.doge_min_amount_description_label');
                    setMinAmount(MIN_CREATE_VAULT_BALANCE.DOGE);
                    setFaucetUrl('https://dogecointf.salmen.website/');
                }
            }
        },
    });

    const handshakeTypeOptions = [
        {
            value: "0",
            label: t('forms.vault.no_handshake_label')
        },
        {
            value: "1",
            label: t('forms.vault.handshake_label')
        }
    ]

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
            redemptionPoolFeeShareBIPS: Number(vault.redemptionPoolFeeShareBIPS) / 100,
            mintingVaultCollateralRatio: Number(vault.mintingVaultCollateralRatioBIPS) / 10000,
            mintingPoolCollateralRatio: Number(vault.mintingPoolCollateralRatioBIPS) / 10000,
            poolExitCollateralRatio: Number(vault.poolExitCollateralRatioBIPS) / 10000,
            buyFAssetByAgentFactor: Number(vault.buyFAssetByAgentFactorBIPS) / 10000,
            poolTopUpCollateralRatio: Number(vault.poolTopupCollateralRatioBIPS) / 10000,
            poolTopUpTokenPriceFactor: Number(vault.poolTopupTokenPriceFactorBIPS) / 10000,
            handshakeType: vault.handshakeType.toString()
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

    const onFAssetTypeChange = (value: string | null, option: any) => {
        form.setValues({
            fAssetType: value
        });
        const vault = vaultCollaterals.data?.find(item => item.fassetSymbol === value);
        if (vault) {
            setVaultCollateralTokens(vault.collaterals.map(collateral => collateral.symbol));
        }
    }

    const onVaultCollateralTokenChange = (value: string | null, option: any) => {
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

    const onHandshakeTypeChange = (value: string | null, option: any) => {
        form.setValues({
            handshakeType: value
        });
    }

    const onKeyDownCapture = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code !== 'Backspace') return;

        event.preventDefault();
        const eventTarget = event.target as HTMLInputElement;

        form.setFieldValue(
            // @ts-ignore
            eventTarget.dataset.path,
            eventTarget.value.substring(0, eventTarget.value.length - 1),
            { forceUpdate: false }
        );
        eventTarget.value = eventTarget.value.substring(0, eventTarget.value.length - 1);
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
                    <Select
                        {...form.getInputProps('handshakeType')}
                        //@ts-ignore
                        key={form.key('handshakeType')}
                        data={handshakeTypeOptions}
                        onChange={(value, option) => onHandshakeTypeChange(value, option)}
                        label={t('forms.vault.handshake_type_label')}
                        description={t('forms.vault.handshake_type_description_label')}
                        placeholder={t('forms.vault.handshake_type_placeholder_label')}
                        withAsterisk
                        className="mt-4 font-normal"
                        disabled={disabled}
                        allowDeselect={false}
                    />
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
                        onKeyDownCapture={onKeyDownCapture}
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
                        onKeyDownCapture={onKeyDownCapture}
                    />
                    {vault !== undefined &&
                        <NumberInput
                            {...form.getInputProps('redemptionPoolFeeShareBIPS')}
                            //@ts-ignore
                            key={form.key('redemptionPoolFeeShareBIPS')}
                            label={t('forms.vault.redemption_pool_fee_share_label')}
                            description={t('forms.vault.redemption_pool_fee_share_description_label')}
                            disabled={isHiddenInputDisabled || disabled}
                            placeholder={t('forms.vault.enter_placeholder')}
                            withAsterisk
                            allowNegative={false}
                            step={1}
                            suffix="%"
                            className="mt-4"
                            onKeyDownCapture={onKeyDownCapture}
                        />
                    }
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
                        onKeyDownCapture={onKeyDownCapture}
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
                        onKeyDownCapture={onKeyDownCapture}
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
                        onKeyDownCapture={onKeyDownCapture}
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
                        onKeyDownCapture={onKeyDownCapture}
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
                        onKeyDownCapture={onKeyDownCapture}
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
                        onKeyDownCapture={onKeyDownCapture}
                    />
                </>
            }
            {minAmountDescriptionLabel &&
                <Trans
                    i18nKey={minAmountDescriptionLabel}
                    parent={Text}
                    size="xs"
                    className="whitespace-pre-line mt-4"
                    components={[
                        <Text
                            size="xs"
                            component="a"
                            target="_blank"
                            href={faucetUrl}
                            c="primary"
                            key="faucet"
                        />,
                        <Text
                            size="xs"
                            component="a"
                            target="_blank"
                            href="https://faucet.flare.network"
                            c="primary"
                            key="flareFaucet"
                        />
                    ]}
                    values={{
                        amount: minAmount
                    }}
                />
            }
        </form>
    )
});

VaultForm.displayName = 'VaultForm';
export default VaultForm;
