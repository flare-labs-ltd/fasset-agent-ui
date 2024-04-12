/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    env: {
        WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID
    }
};

export default nextConfig;
