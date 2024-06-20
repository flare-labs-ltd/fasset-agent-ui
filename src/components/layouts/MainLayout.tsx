import { AppShell, Container, Title, Text } from '@mantine/core';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import ConnectWalletButton from '@/components/elements/ConnectWalletButton';
import LogoIcon from "@/components/icons/LogoIcon";
import FlrIcon from "@/components/icons/FlrIcon";

export interface ILayout {
    children?: React.ReactNode;
}

export default function Layout({ children, ...props }: ILayout) {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{ t('layout.header.title') }</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#b91d47" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <AppShell>
                <AppShell.Main className="flex flex-col pb-10">
                    <Container
                        fluid
                        className="flex justify-between p-1 bg-white px-4 sm:px-8 w-full items-center mb-8"
                    >
                        <div className="flex items-center">
                            <LogoIcon width="60" height="60" />
                            <div className="ml-3">
                                <Title
                                    order={4}
                                >
                                    {t('layout.header.title')}
                                </Title>
                                <div className="flex items-center">
                                    <FlrIcon width="20" height="20" />
                                    <Text className="ml-1">{t('layout.header.beta_label')}</Text>
                                </div>
                            </div>
                        </div>
                        <ConnectWalletButton />
                    </Container>
                    <Container fluid className="flex flex-1 w-full">
                        <div className="relative w-full">
                            {children}
                        </div>
                    </Container>
                </AppShell.Main>
            </AppShell>
        </>
    );
}
