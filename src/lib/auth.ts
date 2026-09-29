import { kvSecondaryStorage } from "@/modules/auth/server/auth-storage";
import { openAPI, organization , bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { ALLOWEDORIGINS } from "@/config/allowed-origins";
import { betterAuth } from "better-auth";
import { env } from "cloudflare:workers";
import { db } from "@/db/client";

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,

    trustedOrigins: [
        env.BETTER_AUTH_URL,
        ...ALLOWEDORIGINS
    ],

    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        customRules: {
            "/request-password-reset": { window: 60, max: 3 },
            "/reset-password": { window: 60, max: 3 },
            "/sign-up/email": { window: 60, max: 5 },
            "/sign-in/email": { window: 60, max: 5 },
            "/sign-in/social": { window: 60, max: 5 },
        },
    },

    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),

    secondaryStorage: kvSecondaryStorage,

    advanced: {
        ipAddress: {
            ipAddressHeaders: ["cf-connecting-ip"],
        },
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            sameSite: "none",
            secure: false,
        },
    },

    plugins: [
        bearer(),
        organization(),
        ...(env.NODE_ENV === "development" ? [openAPI()] : []),
    ],

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },


    emailAndPassword: {
        enabled: false,
        requireEmailVerification: true,
    },

    socialProviders: {
        google: {
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            clientId: env.GOOGLE_CLIENT_ID,
            allowDangerousEmailAccountLinking: true,
        },
    },
});