import {
    Container,
    Title,
    Text,
    JsonInput,
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
    "native_rpc": "",
    "xrp_rpc": "",
    "indexer": "",
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
    "native_private_key": "0xaf7306b82f491c2ae30c14b86443cb31754b4b326a30d634a6750bebf597ad9e",
    "native_address": "0xeCD54647Db49753372CDB90Da857156b854f7afb"
  }
}`;

export default function CreateSecretFile() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            secret: SECRET_TEMPLATE
        },
    });

    const uploadSecret = useUploadSecret();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();

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
                    <Text size="sm" c="gray">{t('agent_configuration.create_secret.card.subtitle')}</Text>
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
                </form>
            </Paper>
        </Container>
    );
}
