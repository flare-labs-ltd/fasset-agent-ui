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
    LoadingOverlay,
    Divider
} from '@mantine/core';
import {
    IconUpload,
    IconPhoto,
    IconX,
} from '@tabler/icons-react';
import {Dropzone, FileWithPath} from '@mantine/dropzone';
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
import BackButton from "@/components/elements/BackButton";
import CopyIcon from "@/components/icons/CopyIcon";
import { ErrorDecoder } from "ethers-decode-error";

const FILE_MAX_SIZE = 5 * 1048576; // 5mb

export default function AgentConfiguration() {
    const secretExists = useSecretExists();
    const workAddress = useWorkAddress(secretExists.data === true);
    const isWhitelisted = useIsWhitelisted(secretExists.data === true && workAddress.data != null);
    const [secretsFile, setSecretsFile] = useState<File>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openConnectWalletModal } = useConnectWalletModal();
    const { account } = useWeb3();
    const { t } = useTranslation();
    const uploadSecret = useUploadSecret();
    const generateWorkAddress = useGenerateWorkAddress();
    const saveWorkAddress = useSaveWorkAddress();
    const contractSetWorkAddress = useSetWorkAddress();

    const onClickUploadSecret = async() => {
        const reader = new FileReader();
        reader.onload = async(event) => {
            try {
                setIsLoading(true);
                const secrets = JSON.parse(event?.target?.result as string);
                if (secrets?.owner?.native?.address) {
                    await contractSetWorkAddress.mutateAsync(secrets.owner.native.address);
                }
                await uploadSecret.mutateAsync(secrets);
                showSucessNotification(t('agent_configuration.secret_card.success_message'));
                secretExists.refetch();
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

        if (secretsFile) {
            reader.readAsText(secretsFile);
        }
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
            const errorDecoder = ErrorDecoder.create();
            const decodedError = await errorDecoder.decode(error);
            showErrorNotification(decodedError.reason);
        }
    }
    const onChangeWorkingAddressClick = async() => {
        try {
            setIsLoading(true);
            if (!account) {
                openConnectWalletModal(async (wallet) => {
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

    const onFileDrop = (files: FileWithPath[]) => {
        setSecretsFile(files[0]);
    }

    return (
        <Container
            size="sm"
        >
            <LoadingOverlay
                visible={isLoading || secretExists.isPending || (isWhitelisted.isStale && isWhitelisted.isPending)}
                zIndex={1000}
                className="fixed"
            />
            {isWhitelisted.data &&
                <BackButton
                    href="/"
                    text={t('agent_configuration.back_button')}
                />
            }
            <Title order={2}>{t('agent_configuration.title')}</Title>
            {!secretExists?.data &&
                <Paper
                    className="mt-5 p-8"
                    withBorder
                >
                    <Title order={5}>{t('agent_configuration.secret_card.title')}</Title>
                    <Text size="sm" c="gray">{t('agent_configuration.secret_card.subtitle')}</Text>
                    <Dropzone
                        onDrop={onFileDrop}
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
                            {secretsFile !== undefined
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
                            disabled={secretsFile === undefined}
                            onClick={onClickUploadSecret}
                        >
                            {t('agent_configuration.secret_card.upload_button')}
                        </Button>
                    </div>
                </Paper>
            }
            {secretExists?.data &&
                <Paper
                    className="mt-5 p-8"
                    withBorder
                >
                    <Input.Wrapper
                        label={t('agent_configuration.working_address_card.title')}
                        description={t('agent_configuration.working_address_card.subtitle')}
                    >
                        <Input
                            value={workAddress.data || ''}
                            disabled={true}
                            className="mt-3"
                            variant="filled"
                            rightSectionPointerEvents="all"
                            rightSection={
                                (!workAddress.isPending ? workAddress.isRefetching : false)
                                    ? <Loader size="xs" />
                                    : workAddress.data && <CopyIcon text={workAddress.data} />
                            }
                            styles={{
                                section: { cursor: 'pointer' },
                                input: { color: 'var(--mantine-color-dark-text)', opacity: 1 }
                            }}
                        />
                    </Input.Wrapper>
                    <Button
                        variant="gradient"
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
                        <>
                            <Divider
                                className="my-8"
                                styles={{
                                    root: {
                                        marginLeft: '-2rem',
                                        marginRight: '-2rem'
                                    }
                                }}
                            />
                            <div className="flex mt-3">
                                <Button
                                    component={Link}
                                    href="/"
                                    fullWidth
                                    size="md"
                                >
                                    {t('agent_configuration.dashboard_button')}
                                </Button>
                            </div>
                        </>
                    }
                </Paper>
            }
        </Container>
    );
}

AgentConfiguration.protected = true;
