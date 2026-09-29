import { auth } from '@/lib/auth';
import { RejectUpload, route, type Router } from '@better-upload/server';
import { cloudflare } from '@better-upload/server/clients';
import { env } from 'cloudflare:workers';

export const uploadRouter: Router = {
    client: cloudflare({
        accountId: env.R2_ACCOUNT_ID,
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    }),
    bucketName: env.R2_BUCKET_NAME,

    routes: {
        images: route({
            fileTypes: ['image/*'],
            onBeforeUpload: async ({ req, file }) => {
                const session = await auth.api.getSession({ headers: req.headers });
                console.log(session, file)
                if (!session) {
                    throw new RejectUpload('Not logged in!');
                }
            },
        }),
    },
};