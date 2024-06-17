import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@mantine/core";

interface IBackButton {
    href: string;
    text: string;
    className?: string;
}

export default function BackButton({ href, text, className }: IBackButton) {
    return (
        <Button
            component={Link}
            href={href}
            variant="transparent"
            leftSection={<IconArrowLeft size={18} />}
            className={`p-0 mb-8 ${className}`}
            fw={400}
        >
            {text}
        </Button>
    );
}
