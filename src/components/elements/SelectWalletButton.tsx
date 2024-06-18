import { useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Box, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { useGlobalStateChainIdWhenNotConnected } from '@/hooks/useNotConnectedChainProvider';
import { IEnabledWallet } from '@/connectors/connectors';
import { AllSupportedChainsType, appChainParams } from '@/chains/chains';
import { useWeb3 } from '@/hooks/useWeb3';
import { useConnectWalletModal } from '@/hooks/useEthereumLogin';
import classes from '@/styles/components/elements/SelectWalletButton.module.scss';

export default function SelectWalletButton({ wallet, disabled = false }: { wallet: IEnabledWallet, disabled?: boolean }) {
    const { connector, hooks } = wallet;
    const { supportedChainId } = useWeb3();
    const { useIsActive } = hooks;
    const { t } = useTranslation();
    const [error, setError] = useState<boolean>(false);
    const { notConnectedChainId, setNotConnectedChainId } = useGlobalStateChainIdWhenNotConnected();
    const { closeConnectWalletModal, openConnectWalletModalCallback } = useConnectWalletModal();
    const router = useRouter();

    const desiredChainId = notConnectedChainId || appChainParams.desiredChainID;
    const isActive = useIsActive();
    const isMetamaskAndNotInstalled = connector instanceof MetaMask && !window.ethereum;
    const isMetamaskAndOnMobile = connector instanceof MetaMask && isMobile && !window.ethereum;

    const deactivateConnector = async() => {
        connector?.deactivate
            ? await connector.deactivate()
            : await connector.resetState();

        window.localStorage.setItem(
            'ACTIVE_CONNECTION',
            JSON.stringify({
                wallet: undefined,
            })
        );
        Object.keys(localStorage)
            .filter((item) => item.startsWith('wc@'))
            .forEach((item) => localStorage.removeItem(item));
        setNotConnectedChainId(supportedChainId as AllSupportedChainsType);
        closeConnectWalletModal();
        router.push('/connect');
    };

    const activateConnector = async() => {
        // handle if MetaMask on mobile
        if (isMetamaskAndOnMobile) {
            const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
            window.open(`https://metamask.app.link/dapp/${origin}${router.asPath}/`);
            return;
        }
        // handle if MetaMask is not installed
        if (isMetamaskAndNotInstalled && !isMobile) {
            window.open('https://metamask.io', '_blank');
            return;
        }

        setError(false);
        if (connector instanceof WalletConnectV2 || connector instanceof Network || connector instanceof MetaMask || connector instanceof CoinbaseWallet) {
            if (connector instanceof WalletConnectV2) {
                closeConnectWalletModal();
            }

            window.localStorage.setItem(
                'ACTIVE_CONNECTION',
                JSON.stringify({
                    wallet:
                        connector instanceof WalletConnectV2
                            ? 'WalletConnect'
                            : connector instanceof MetaMask
                                ? 'MetaMask'
                                : connector instanceof CoinbaseWallet
                                    ? 'CoinbaseWallet'
                                    : undefined,
                })
            );

            try {
                connector instanceof WalletConnectV2
                    ? await connector.activate()
                    : await connector.activate(desiredChainId);
            } catch (error: any) {
                notifications.show({
                    title: t('select_wallet_button.error_title'),
                    color: 'red',
                    message: error.message
                });
                if (error.code === 4902 || error.code === 32603 || error.data?.originalError?.code === 4902 || error.code === -32000) {
                    try {
                        await connector.activate();
                        setError(false);
                    } catch (error) {
                        setError(true);
                        window.localStorage.setItem(
                            'ACTIVE_CONNECTION',
                            JSON.stringify({
                                wallet: undefined,
                            })
                        );
                        return;
                    }
                }
            }
        } else {
            try {
                // @ts-ignore
                await connector.activate();
                setError(false);
            } catch (error: any) {
                try {
                    // @ts-ignore
                    await connector.activate();
                    setError(false);
                } catch (error) {
                    setError(true);
                    window.localStorage.setItem(
                        'ACTIVE_CONNECTION',
                        JSON.stringify({
                            wallet: undefined,
                        })
                    );
                    return;
                }
            }
        }

        closeConnectWalletModal();
        const connectionData = window.localStorage.getItem('ACTIVE_CONNECTION');

        if (connectionData !== null) {
            const data = JSON.parse(connectionData);
            if (openConnectWalletModalCallback) openConnectWalletModalCallback(data.wallet);
            // except from metamask, we need to hard reload page to properly work with wallet
            if (data.wallet && connector instanceof CoinbaseWallet) {
                router.reload();
            }
        }
    }

    const onClick = useCallback(async() => {
        if (isActive) {
            await deactivateConnector();
        } else {
            await activateConnector();
        }
    }, [
        closeConnectWalletModal,
        connector,
        desiredChainId,
        isActive,
        isMetamaskAndNotInstalled,
        isMetamaskAndOnMobile,
        setNotConnectedChainId,
        supportedChainId
    ]);

    return (
        <UnstyledButton onClick={onClick}>
            <Box
                pr="12px"
                pl="28px"
                p={9}
                style={(theme) => ({
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    color: isActive ? '#ffffff' : theme.primaryColor,
                })}
                className={`${classes.button} ${isActive ? classes.isActive : ''}`}
            >
                <Group justify="space-between">
                    <Stack gap={0}>
                        <Text fw={700} c="dark">
                            {wallet.name}
                        </Text>
                        <Text size="xs" c="dark">
                            {error
                                ? t('select_wallet_button.try_again_label')
                                : isActive
                                    ? t('select_wallet_button.disconnect_label')
                                    : isMetamaskAndOnMobile
                                        ? t('select_wallet_button.open_app_label')
                                        : isMetamaskAndNotInstalled
                                            ? t('select_wallet_button.install_label')
                                            : t('select_wallet_button.connect_label')
                            }
                        </Text>
                    </Stack>
                    <wallet.icon height={'45px'} width={'45px'} />
                </Group>
            </Box>
        </UnstyledButton>
    );
}
