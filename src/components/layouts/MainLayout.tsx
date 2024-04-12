import { AppShell, Container, Title } from '@mantine/core';
import ConnectWalletButton from "@/components/elements/ConnectWalletButton";
import Head from 'next/head';
import { Roboto } from "next/font/google";
import { useTranslation } from 'react-i18next';

const roboto = Roboto({
    subsets: ["latin"],
    weight: ['100', '300', '400', '500', '700', '900']
});

export interface LayoutInputProps {
    children?: React.ReactNode;
}

export default function Layout({ children, ...props }: LayoutInputProps): JSX.Element {
    const { t } = useTranslation();

    return (
        <>
            <Head padding="md">
                <title>{ t('layout.header.title') }</title>
            </Head>
            <AppShell className={roboto.className}>
                <AppShell.Main className="flex flex-col">
                    <Container
                        fluid
                        className="flex justify-between p-4 w-full"
                    >
                        <Title order={4}>{ t('layout.header.title') }</Title>
                        <ConnectWalletButton />
                    </Container>
                    <Container className="flex flex-1">
                        <div className="self-center">
                            {children}
                        </div>
                    </Container>
                </AppShell.Main>
            </AppShell>
        </>
    );
}
