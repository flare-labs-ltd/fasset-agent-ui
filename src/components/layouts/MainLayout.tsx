import { AppShell, Container, Title } from '@mantine/core';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import ConnectWalletButton from '@/components/elements/ConnectWalletButton';

export interface ILayout {
    children?: React.ReactNode;
}

export default function Layout({ children, ...props }: ILayout) {
    const { t } = useTranslation();

    return (
        <>
            <Head padding="md">
                <title>{ t('layout.header.title') }</title>
            </Head>
            <AppShell>
                <AppShell.Main className="flex flex-col pb-10">
                    <Container
                        fluid
                        className="flex justify-between p-4 w-full items-center"
                    >
                        <Title order={4}>{ t('layout.header.title') }</Title>
                        <ConnectWalletButton />
                    </Container>
                    <Container className="flex flex-1 w-full">
                        <div className="self-center w-full">
                            {children}
                        </div>
                    </Container>
                </AppShell.Main>
            </AppShell>
        </>
    );
}
