// src/server/api.ts
import { Scalar } from '@scalar/hono-api-reference';
import { createApp } from './lib/create-app';
import { auth } from '@/lib/auth';
import { cors } from 'hono/cors'; 
import { uploadApp } from './modules/upload/server/upload-app';

const app = createApp().basePath('/api');

app.use('*', cors({
    origin: (origin) => origin || "*",
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],              
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length', 'Set-Cookie'],
    maxAge: 600,
    credentials: true,    
}));

app.on(["POST", "GET", "OPTIONS"], "/auth/*", (c) => auth.handler(c.req.raw));
app.route("/upload", uploadApp);

app.doc('/reference/json', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'EZ Order API',
    },
});

app.onError((err, c) => {
    console.error("Unhandled Error:", err);
    return c.json({ error: err.message }, 500);
});

app.get('/reference', Scalar({
    url: '/api/reference/json',
    pageTitle: 'EZ Order API',
    theme: 'kepler'
}));

export default app;
