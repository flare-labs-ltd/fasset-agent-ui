import { Anchor, Container, Paper, Text } from "@mantine/core";
import { Trans } from "react-i18next";

export default function Configure() {
    return (
        <Container
            size="sm"
        >
            <Paper
                className="mt-5 p-4"
            >
                <Trans
                    i18nKey="configure.secrets_file_missing_label"
                    parent={Text}
                    size="sm"
                    components={{
                        a: <Anchor
                            underline="always"
                            href="https://docs.flare.network/infra/fassets/deploying-agent/#setting-up-the-agent"
                            target="_blank"
                            c="black"
                        >
                            https://docs.flare.network/infra/fassets/deploying-agent/#setting-up-the-agent
                        </Anchor>,
                    }}
                />
            </Paper>
        </Container>
    );
}
