import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    meta: {
        meta: [
            { name: "viewport", content: "width=device-width, initial-scale=1" },
        ],
        script: [],
        link: [
        ],
    },
    alias: {
        '~/*': './*',
    },
    runtimeConfig: {
        secretKey: '', // variable that can only be accessed on the server side
        base_api: process.env.BASE_URL_API,
        public: {
            BASE_URL_API: process.env.BASE_URL_API || 'https://nuxtjs.org' // variable that can also be accessed on the client side
        }
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
    },
    css: [
        "~/assets/css/tailwind.css",
        "~/assets/css/app.css"
    ],
});