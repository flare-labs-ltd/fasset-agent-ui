/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    env: {
        WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
        FASSET_SYMBOL: process.env.FASSET_SYMBOL,
        FASSET_API_KEY: process.env.FASSET_API_KEY,
        API_URL: process.env.API_URL,
        APP_VERSION: process.env.npm_package_version
    }
};

export default nextConfig;
