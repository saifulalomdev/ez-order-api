import type { SecondaryStorage } from "better-auth";
import { env } from "cloudflare:workers";

export const kvSecondaryStorage: SecondaryStorage = {
  get: async (key: string) => {
    return await env.EZ_ORDER_KV_CACHE.get(key);
  },
  set: async (key, value, ttl) => {
    await env.EZ_ORDER_KV_CACHE.put(key, value, {
      expirationTtl: ttl,
    });
  },
  delete: async (key) => {
    await env.EZ_ORDER_KV_CACHE.delete(key);
  },
  getAndDelete: async (key) => {
    const value = await env.EZ_ORDER_KV_CACHE.get(key);
    if (value !== null) {
      await env.EZ_ORDER_KV_CACHE.delete(key);
      return value;
    }
    return null;
  },
  increment: async (key, windowDuration = 60) => {
    const value = await env.EZ_ORDER_KV_CACHE.get(key);
    const currentNumber = value ? parseInt(value, 10) : 0;
    const newNumber = currentNumber + 1;

    await env.EZ_ORDER_KV_CACHE.put(key, newNumber.toString(), {
      expirationTtl: windowDuration,
    });
    return newNumber;
  },
};