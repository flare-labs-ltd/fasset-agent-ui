import {
    Container,
    Title,
    Card,
    Button,
    PasswordInput
} from "@mantine/core";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/api/auth";
import { useWeb3 } from "@/hooks/useWeb3";
import apiClient from "@/api/apiClient";

interface IFormValues {
    password: string | undefined;
}

export default function Login() {
    const { t } = useTranslation();
    const login = useLogin();
    const router = useRouter();
    const { setAuthenticated } = useWeb3();

    const schema = yup.object().shape({
        password: yup.string().required(t('validation.messages.required', {field: t('forms.login.password_label')}))
    });

    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            password: '',
        },
        //@ts-ignore
        validate: yupResolver(schema),
    });

    const onLoginClick = async () => {
        try {
            const status = await form.validate();
            if (status.hasErrors) return;

            const values = form.getValues();
            const response = await login.mutateAsync(values.password as string);
            window.localStorage.setItem('FASSET_TOKEN', response.data);
            apiClient.defaults.headers.common = { Authorization: `Bearer ${response.data}`};
            setAuthenticated(true);
            await router.push('/');
        } catch (error: any) {
            form.setFieldError('password', error.response.data.message);
        }
    }

    return (
        <Container
            size="xs"
            className="flex flex-col items-center w-full absolute -translate-y-2/4 -translate-x-2/4 top-2/4 left-2/4"
        >
            <Title
                order={2}
                fw={700}
            >
                {t('login.title')}
            </Title>
            <Card
                shadow="sm"
                className="mt-8 w-full"
            >
                <form className="flex flex-col" onSubmit={e => { e.preventDefault(); }}>
                    <PasswordInput
                        {...form.getInputProps('password')}
                        //@ts-ignore
                        key={form.key('password')}
                    />
                    <Button
                        variant="filled"
                        onClick={onLoginClick}
                        size="lg"
                        fw={300}
                        loading={login.isPending}
                        className="mt-5 mx-auto px-12"
                        type="submit"
                    >
                        {t('login.login_button')}
                    </Button>
                </form>
            </Card>
        </Container>
    );
}
