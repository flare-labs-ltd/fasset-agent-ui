import {
    Container,
    Title,
    Text,
    JsonInput,
    Paper,
    Button,
    LoadingOverlay
} from '@mantine/core';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { useUploadSecret, useSecretsTemplate } from '@/api/agent';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';

export default function CreateSecretFile() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            secret: ''
        },
    });

    const uploadSecret = useUploadSecret();
    const secretsTemplate = useSecretsTemplate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (secretsTemplate.isPending) return;
        form.setValues({
            secret: JSON.stringify(secretsTemplate.data, null, 2)
        })
    }, [secretsTemplate.isPending]);

    const onSubmit = async(secret: string) => {
        try {
            setIsLoading(true);
            secret = JSON.parse(secret);
            const response = await uploadSecret.mutateAsync(secret);
            if (response.status === 'ERROR') {
                form.setErrors({ secret: response.errorMessage });
                return;
            }
            showSucessNotification(t('agent_configuration.create_secret.success_message'));
        } catch (error) {
            if ((error as any).message) {
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
            <Button
                component={Link}
                href="/configure/"
                variant="transparent"
                leftSection={<IconArrowLeft size={18} />}
                className="p-0 mb-3"
            >
                {t('agent_configuration.create_secret.back_button')}
            </Button>
            <Title order={2}>{t('agent_configuration.create_secret.title')}</Title>
            <Paper
                className="mt-5 p-4"
                withBorder
            >
                <form onSubmit={form.onSubmit(form => onSubmit(form.secret))}>
                    <Title order={5}>{t('agent_configuration.create_secret.card.title')}</Title>
                    <div>
                        <LoadingOverlay visible={secretsTemplate.isPending} />
                        <JsonInput
                            {...form.getInputProps('secret')}
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
