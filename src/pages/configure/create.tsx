import {
    Container,
    Title,
    Paper,
    Button,
    LoadingOverlay,
    JsonInput
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useUploadSecret, useSecretsTemplate } from '@/api/agent';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import { useSetWorkAddress } from '@/hooks/useContracts';
import {ISecretsTemplate} from "@/types";
import BackButton from "@/components/elements/BackButton";

export default function CreateSecretFile() {
    const uploadSecret = useUploadSecret();
    const secretsTemplate = useSecretsTemplate();
    const contractSetWorkAddress = useSetWorkAddress();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const schema = yup.object().shape({
        secrets: yup.string().required(t('validation.messages.required', { field: t('agent_configuration.create_secret.secrets_label') })),
    });

    const form = useForm({
        mode: 'uncontrolled',
        validate: yupResolver(schema),
        initialValues: {
            secrets: ''
        },
    });

    useEffect(() => {
        if (secretsTemplate.isPending) return;
        form.setValues({
            secrets: JSON.stringify(secretsTemplate.data, null, 4)
        });
    }, [secretsTemplate.isPending]);

    const onSubmit = async(secrets: string) => {
        try {
            setIsLoading(true);
            const secretsJson: ISecretsTemplate = JSON.parse(secrets);

            if (secretsJson?.owner?.native?.address) {
                await contractSetWorkAddress.mutateAsync(secretsJson.owner.native.address);
            }

            await uploadSecret.mutateAsync(secretsJson);
            showSucessNotification(t('agent_configuration.create_secret.success_message'));
        } catch (error) {
            if ((error as any)?.response?.data?.message) {
                showErrorNotification((error as any).response.data.message);
            } else if ((error as any).message) {
                showErrorNotification((error as any).message);
            } else {
                showErrorNotification(t('agent_configuration.create_secret.error_message'));
            }

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container
            size="sm"
        >
            <BackButton
                href="/configure/"
                text={t('agent_configuration.create_secret.back_button')}
            />
            <Title order={2}>{t('agent_configuration.create_secret.title')}</Title>
            <Paper
                className="mt-5 p-4"
            >
                <form onSubmit={form.onSubmit(form => onSubmit(form.secrets))}>
                    <Title order={5}>{t('agent_configuration.create_secret.card.title')}</Title>
                    <div>
                        <LoadingOverlay visible={secretsTemplate.isPending} />
                        <JsonInput
                            {...form.getInputProps('secrets')}
                            //@ts-ignore
                            key={form.key('secrets')}
                            autosize={true}
                            minRows={5}
                            className="mt-3"
                        />
                        <div className="flex justify-end mt-3">
                            <Button
                                type="submit"
                                loading={isLoading}
                            >
                                {t('agent_configuration.create_secret.card.save_button')}
                            </Button>
                        </div>
                    </div>
                </form>
            </Paper>
        </Container>
    );
}
