import {
    Container,
    Title,
    Paper,
    Text,
    Button,
    Group,
    rem,
    Input,
    Loader,
    LoadingOverlay
} from '@mantine/core';
import {
    IconUpload,
    IconPhoto,
    IconX,
    IconCopy,
    IconArrowLeft
} from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    useGenerateWorkAddress,
    useIsWhitelisted,
    useSaveWorkAddress,
    useSecretExists,
    useUploadSecret,
    useWorkAddress
} from '@/api/agent';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import { useConnectWalletModal } from "@/hooks/useEthereumLogin";
import { useWeb3 } from "@/hooks/useWeb3";
import { useSetWorkAddress } from "@/hooks/useContracts";

const FILE_MAX_SIZE = 5 * 1048576; // 5mb

export default function AgentConfiguration() {
    const secretExists = useSecretExists();
    const workAddress = useWorkAddress(secretExists.data === true);
    const isWhitelisted = useIsWhitelisted(secretExists.data === true && workAddress.data != null);
    const [secretsFile, useSecretsFile] = useState<File|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openConnectWalletModal } = useConnectWalletModal();
    const { account } = useWeb3();
    const { t } = useTranslation();
    const uploadSecret = useUploadSecret();
    const generateWorkAddress = useGenerateWorkAddress();
    const saveWorkAddress = useSaveWorkAddress();
    const contractSetWorkAddress = useSetWorkAddress();

    const onClickUploadSecret = async(): Promise<void> => {
        const reader = new FileReader();
        reader.onload = async(event) => {
            try {
                setIsLoading(true);
                const secrets = JSON.parse(event.target.result);
                if (secrets?.owner?.native?.address) {
                    await contractSetWorkAddress.mutateAsync(secrets.owner.native.address);
                }
                uploadSecret.mutateAsync(secrets);
                showSucessNotification(t('agent_configuration.secret_card.success_message'));
            } catch (error) {
                if ((error as any)?.response?.data?.message) {
                    showErrorNotification((error as any).response.data.message);
                } else if ((error as any).message) {
                    showErrorNotification((error as any).message);
                } else {
                    showErrorNotification(t('agent_configuration.secret_card.error_message'));
                }
            } finally {
                setIsLoading(false);
            }

        }
        reader.readAsText(secretsFile);
    }

    const generateAddress = async() => {
        try {
            const response = await generateWorkAddress.mutateAsync();
            await contractSetWorkAddress.mutateAsync(response.data.address);
            await saveWorkAddress.mutateAsync({
                publicAddress: response.data.address,
                privateKey: response.data.privateKey
            });
            workAddress.refetch();
            showSucessNotification(t('agent_configuration.working_address_card.success_message'));
        } catch (error) {
            showErrorNotification((error as any).message);
        }
    }
    const onChangeWorkingAddressClick = async() => {
        try {
            setIsLoading(true);
            if (!account) {
                openConnectWalletModal(async(wallet) => {
                    if (!wallet) return;
                    await generateAddress();
                });
                return;
            }

            await generateAddress();
        } catch (error) {
            showErrorNotification((error as any).message);
        } finally {
            setIsLoading(false);
        }
    }
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <Container
            size="sm"
        >
            <LoadingOverlay
                visible={isLoading || secretExists.isPending || (isWhitelisted.isStale && isWhitelisted.isPending)}
                zIndex={1000}
            />
            {isWhitelisted.data &&
                <Button
                    component={Link}
                    href="/"
                    variant="transparent"
                    leftSection={<IconArrowLeft size={18} />}
                    className="p-0 mb-3"
                >
                    {t('agent_configuration.back_button')}
                </Button>
            }
            <Title order={2}>{t('agent_configuration.title')}</Title>
            <Paper
                className="mt-5 p-4"
                withBorder
            >
                <Title order={5}>{t('agent_configuration.secret_card.title')}</Title>
                <Text size="sm" c="gray">{t('agent_configuration.secret_card.subtitle')}</Text>
                <Dropzone
                    onDrop={(files) => useSecretsFile(files[0])}
                    maxSize={FILE_MAX_SIZE}
                    multiple={false}
                    accept={['application/json']}
                    className="mt-5 flex justify-center"
                >
                    <Group className="flex-nowrap pointer-events-none">
                        <Dropzone.Accept>
                            <IconUpload
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-black-6)' }}
                                stroke={1.5}
                            />
                        </Dropzone.Idle>
                        {secretsFile !== null
                            ? <Text>{secretsFile.name}</Text>
                            : <div>
                                <Text
                                    size="lg"
                                    inline
                                >
                                    {t('agent_configuration.secret_card.drag_file_label')}
                                </Text>
                                <Text
                                    size="sm"
                                    c="gray"
                                    className="mt-1"
                                >
                                    {t('agent_configuration.secret_card.file_size_label')}
                                </Text>
                            </div>
                        }
                    </Group>
                </Dropzone>
                <div className="mt-3 flex">
                    <Button
                        component={Link}
                        href="/configure/create"
                        variant="outline"
                        size="xs"
                        className="mr-2"
                    >
                        {t('agent_configuration.secret_card.create_button')}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={secretsFile === null}
                        onClick={onClickUploadSecret}
                    >
                        {t('agent_configuration.secret_card.upload_button')}
                    </Button>
                </div>
            </Paper>
            <Paper
                className="mt-5 p-4"
                withBorder
            >
                <Title order={5}>{t('agent_configuration.working_address_card.title')}</Title>
                <Text size="sm" c="gray">{t('agent_configuration.working_address_card.subtitle')}</Text>
                <Input
                    value={workAddress.data || ''}
                    disabled={true}
                    className="mt-3"
                    rightSectionPointerEvents="all"
                    rightSection={
                        (!workAddress.isPending ? workAddress.isRefetching : false)
                            ? <Loader size="xs" />
                            : workAddress.data && <IconCopy
                                color="black"
                                style={{ width: rem(20), height: rem(20) }}
                                onClick={() => copyToClipboard(workAddress.data)}
                            />
                    }
                    styles={{
                        section: { cursor: 'pointer' }
                    }}
                />
                <Button
                    variant="outline"
                    size="xs"
                    className="mt-3"
                    onClick={onChangeWorkingAddressClick}
                >
                    {t('agent_configuration.working_address_card.change_button')}
                </Button>
                {isWhitelisted.data === false &&
                    <div className="mt-3">
                        <Title order={5}>{t('agent_configuration.working_address_card.not_whitelisted_title')}</Title>
                        <Text size="sm" c="gray">{t('agent_configuration.working_address_card.not_whitelisted_text')}</Text>
                    </div>
                }
                {isWhitelisted.data === true &&
                    <div className="flex justify-end mt-3">
                        <Button
                            component={Link}
                            href="/"
                        >
                            {t('agent_configuration.dashboard_button')}
                        </Button>
                    </div>
                }
            </Paper>
        </Container>
    );
}
