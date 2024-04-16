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
import { ethers } from 'ethers';
import { useUploadSecret, useWorkAddress} from '@/api/agent';
import { useState } from 'react';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import { useConnectWalletModal } from "@/components/elements/connect-wallet/hooks/useEthereumLogin";
import { useWeb3 } from "@/components/elements/connect-wallet/hooks/useWeb3";

const FILE_MAX_SIZE = 5 * 1048576;

export default function AgentConfiguration(): JSX.Element {
    const [secretsFile, useSecretsFile] = useState<File|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openConnectWalletModal } = useConnectWalletModal();
    const { account } = useWeb3();
    const { t } = useTranslation();
    const workAddress = useWorkAddress();
    const uploadSecret = useUploadSecret();

    const onClickUploadSecret = async(): Promise<void> => {
        const reader = new FileReader();
        reader.onload = async(event) => {
            try {
                setIsLoading(true);
                const secret = JSON.parse(event.target.result);
                uploadSecret.mutateAsync(secret);
                showSucessNotification(t('agent_configuration.secret_card.success_message'));
            } catch (error) {
                showErrorNotification(t('agent_configuration.secret_card.error_message'));
            } finally {
                setIsLoading(false);
            }

        }
        reader.readAsText(secretsFile);
    }
    const onChangeWorkingAddressClick = async(): Promise<void> => {
        try {
            setIsLoading(true);
            if (!account) {
                openConnectWalletModal();
                return;
            }


            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log(signer);
            const sig = await signer.signMessage('fooooo');

            const abi = [
                {
                    "type": "constructor",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_governanceSettings",
                            "internalType": "contract IGovernanceSettings"
                        },
                        {
                            "type": "address",
                            "name": "_initialGovernance",
                            "internalType": "address"
                        },
                        {
                            "type": "bool",
                            "name": "_supportRevoke",
                            "internalType": "bool"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "addAddressToWhitelist",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_address",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "addAddressesToWhitelist",
                    "inputs": [
                        {
                            "type": "address[]",
                            "name": "_addresses",
                            "internalType": "address[]"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "bool",
                            "name": "",
                            "internalType": "bool"
                        }
                    ],
                    "name": "allowAll",
                    "inputs": []
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "cancelGovernanceCall",
                    "inputs": [
                        {
                            "type": "bytes4",
                            "name": "_selector",
                            "internalType": "bytes4"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "executeGovernanceCall",
                    "inputs": [
                        {
                            "type": "bytes4",
                            "name": "_selector",
                            "internalType": "bytes4"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "string",
                            "name": "",
                            "internalType": "string"
                        }
                    ],
                    "name": "getAgentDescription",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_managementAddress",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "string",
                            "name": "",
                            "internalType": "string"
                        }
                    ],
                    "name": "getAgentIconUrl",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_managementAddress",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "string",
                            "name": "",
                            "internalType": "string"
                        }
                    ],
                    "name": "getAgentName",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_managementAddress",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "address",
                            "name": "",
                            "internalType": "address"
                        }
                    ],
                    "name": "getManagementAddress",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_workAddress",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "address",
                            "name": "",
                            "internalType": "address"
                        }
                    ],
                    "name": "getWorkAddress",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_managementAddress",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "address",
                            "name": "",
                            "internalType": "address"
                        }
                    ],
                    "name": "governance",
                    "inputs": []
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "address",
                            "name": "",
                            "internalType": "contract IGovernanceSettings"
                        }
                    ],
                    "name": "governanceSettings",
                    "inputs": []
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "initialise",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_governanceSettings",
                            "internalType": "contract IGovernanceSettings"
                        },
                        {
                            "type": "address",
                            "name": "_initialGovernance",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "bool",
                            "name": "",
                            "internalType": "bool"
                        }
                    ],
                    "name": "isExecutor",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_address",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "bool",
                            "name": "",
                            "internalType": "bool"
                        }
                    ],
                    "name": "isWhitelisted",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_address",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "bool",
                            "name": "",
                            "internalType": "bool"
                        }
                    ],
                    "name": "productionMode",
                    "inputs": []
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "revokeAddress",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_address",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "setAllowAll",
                    "inputs": [
                        {
                            "type": "bool",
                            "name": "_allowAll",
                            "internalType": "bool"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "setWorkAddress",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_ownerWorkAddress",
                            "internalType": "address"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "pure",
                    "outputs": [
                        {
                            "type": "bool",
                            "name": "",
                            "internalType": "bool"
                        }
                    ],
                    "name": "supportsInterface",
                    "inputs": [
                        {
                            "type": "bytes4",
                            "name": "_interfaceId",
                            "internalType": "bytes4"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "bool",
                            "name": "",
                            "internalType": "bool"
                        }
                    ],
                    "name": "supportsRevoke",
                    "inputs": []
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "switchToProductionMode",
                    "inputs": []
                },
                {
                    "type": "function",
                    "stateMutability": "view",
                    "outputs": [
                        {
                            "type": "uint256",
                            "name": "allowedAfterTimestamp",
                            "internalType": "uint256"
                        },
                        {
                            "type": "bytes",
                            "name": "encodedCall",
                            "internalType": "bytes"
                        }
                    ],
                    "name": "timelockedCalls",
                    "inputs": [
                        {
                            "type": "bytes4",
                            "name": "",
                            "internalType": "bytes4"
                        }
                    ]
                },
                {
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "outputs": [],
                    "name": "whitelistAndDescribeAgent",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "_managementAddress",
                            "internalType": "address"
                        },
                        {
                            "type": "string",
                            "name": "_name",
                            "internalType": "string"
                        },
                        {
                            "type": "string",
                            "name": "_description",
                            "internalType": "string"
                        },
                        {
                            "type": "string",
                            "name": "_iconUrl",
                            "internalType": "string"
                        }
                    ]
                },
                {
                    "type": "event",
                    "name": "AgentDataChanged",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "managementAddress",
                            "indexed": true
                        },
                        {
                            "type": "string",
                            "name": "name",
                            "indexed": false
                        },
                        {
                            "type": "string",
                            "name": "description",
                            "indexed": false
                        },
                        {
                            "type": "string",
                            "name": "iconUrl",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "GovernanceCallTimelocked",
                    "inputs": [
                        {
                            "type": "bytes4",
                            "name": "selector",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "allowedAfterTimestamp",
                            "indexed": false
                        },
                        {
                            "type": "bytes",
                            "name": "encodedCall",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "GovernanceInitialised",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "initialGovernance",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "GovernedProductionModeEntered",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "governanceSettings",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "TimelockedGovernanceCallCanceled",
                    "inputs": [
                        {
                            "type": "bytes4",
                            "name": "selector",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "timestamp",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "TimelockedGovernanceCallExecuted",
                    "inputs": [
                        {
                            "type": "bytes4",
                            "name": "selector",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "timestamp",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "Whitelisted",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "value",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "WhitelistingRevoked",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "value",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                },
                {
                    "type": "event",
                    "name": "WorkAddressChanged",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "managementAddress",
                            "indexed": true
                        },
                        {
                            "type": "address",
                            "name": "prevWorkAddress",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "workAddress",
                            "indexed": false
                        }
                    ],
                    "anonymous": false
                }
            ];

            const contract = new ethers.Contract("0x746cBEAa5F4CAB057f70e10c2001b3137Ac223B7", abi, signer);
            const foo  = await contract.getAgentDescription("0x19E2b0f41c09250Bf2A024187593d9B6DCA48da8");
            console.log(foo)
            /*
            * User klikne na gumb za zamenjavo working addrese.
            * Na frontu se kliče api endpoint generateWorkAddress (moramo še dodati), ta pošlje nazaj na front address in private key.
            * Na frontendu se kliče pogodbo AgentOwnerRegistry, kjer se kliče funkcijo setWorkAddress, kjer se poda address ki ga je generiral backend.
            * Ko se transakcija izvede frontend kliče endpoint 'workAddress/:publicAddress/:privateKey', ki bo shranil ta work address v secrets file.
            */

            showSucessNotification(t('agent_configuration.working_address_card.success_message'));
        } catch (error) {
            console.log('x', error);
            showErrorNotification((error as any).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container
            size="sm"
        >
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
            />
            <Button
                component={Link}
                href="/agent-configuration"
                variant="transparent"
                leftSection={<IconArrowLeft size={18} />}
                className="p-0 mb-3"
            >
                {t('agent_configuration.back_button')}
            </Button>
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
                        href="/agent-configuration/create"
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
                    rightSection={
                        !workAddress.isPending
                            ? <IconCopy
                                color="black"
                                style={{ width: rem(20), height: rem(20) }}
                            />
                            : <Loader size="xs" />
                    }
                />
                <Button
                    variant="outline"
                    size="xs"
                    className="mt-3"
                    onClick={onChangeWorkingAddressClick}
                >
                    {t('agent_configuration.working_address_card.change_button')}
                </Button>
                <div className="mt-3">
                    <Title order={5}>{t('agent_configuration.working_address_card.not_whitelisted_title')}</Title>
                    <Text size="sm" c="gray">{t('agent_configuration.working_address_card.not_whitelisted_text')}</Text>
                </div>
                <div className="flex justify-end mt-3">
                    <Button>
                        {t('agent_configuration.dashboard_button')}
                    </Button>
                </div>
            </Paper>
        </Container>
    );
}
