import { handleRequest } from "@better-upload/server";
import { uploadRouter } from "./upload-route";
import { createApp } from "@/lib/create-app";

const uploadApp = createApp();

uploadApp.all("/*", async (c) => {
  return handleRequest(c.req.raw, uploadRouter);
});

export { uploadApp };