import {
    Container,
    Title,
    Text,
    Textarea,
    Paper,
    Button
} from '@mantine/core';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { useUploadSecret } from '@/api/agent';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';

const SECRET_TEMPLATE = `{
  "wallet": {
    "encryption_password": ""
  },
  "apiKey": {
    "indexer": "",
    "native_rpc": "",
    "agent_bot": ""
  },
  "owner": {
    "management": {
      "address": ""
    },
    "native": {
      "address": "",
      "private_key": ""
    },
    "testXRP": {
      "address": "",
      "private_key": ""
    }
  },
  "timeKeeper": {
    "address": "",
    "private_key": ""
  }
}`;

export default function CreateSecretsFile(): JSX.Element {
    const form = useForm({
        initialValues: {
            secret: SECRET_TEMPLATE
        },
    });
    const uploadSecret = useUploadSecret();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const onSubmit = async(form) => {
        try {
            setIsLoading(true);
            const secret = JSON.parse(form.secret);
            uploadSecret.mutateAsync(secret);
            showSucessNotification(t('agent_configuration.create_secret.success_message'));

        } catch (error) {
            showErrorNotification(t('agent_configuration.create_secret.error_message'));

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
                href="/agent-configuration"
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
                <form onSubmit={form.onSubmit(form => onSubmit(form))}>
                    <Title order={5}>{t('agent_configuration.create_secret.card.title')}</Title>
                    <Text size="sm" c="gray">{t('agent_configuration.create_secret.card.subtitle')}</Text>
                    <Textarea
                        {...form.getInputProps('secret')}
                        autosize
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
                </form>
            </Paper>
        </Container>
    );
}
