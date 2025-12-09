import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const configSchema = z
    .object({
        APP_PORT: z
            .string()
            .default('3010')
            .transform((port) => parseInt(port, 10)),
        REMNAWAVE_PANEL_URL: z.string(),

        MARZBAN_LEGACY_LINK_ENABLED: z
            .string()
            .default('false')
            .transform((val) => val === 'true'),
        MARZBAN_LEGACY_SECRET_KEY: z.optional(z.string()),
        REMNAWAVE_API_TOKEN: z.optional(z.string()),

        MARZBAN_LEGACY_SUBSCRIPTION_VALID_FROM: z.optional(z.string()),

        CUSTOM_SUB_PREFIX: z.optional(z.string()),

        CADDY_AUTH_API_TOKEN: z.optional(z.string()),

        META_TITLE: z.string(),
        META_DESCRIPTION: z.string(),

        CLOUDFLARE_ZERO_TRUST_CLIENT_ID: z.optional(z.string()),
        CLOUDFLARE_ZERO_TRUST_CLIENT_SECRET: z.optional(z.string()),

        SUBSCRIPTION_UI_DISPLAY_RAW_KEYS: z
            .string()
            .default('false')
            .transform((val) => val === 'true'),
    })
    .superRefine((data, ctx) => {
        if (
            !data.REMNAWAVE_PANEL_URL.startsWith('http://') &&
            !data.REMNAWAVE_PANEL_URL.startsWith('https://')
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'REMNAWAVE_PANEL_URL must start with http:// or https://',
                path: ['REMNAWAVE_PANEL_URL'],
            });
        }
        if (data.MARZBAN_LEGACY_LINK_ENABLED === true) {
            if (!data.MARZBAN_LEGACY_SECRET_KEY) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'MARZBAN_LEGACY_SECRET_KEY is required when MARZBAN_LEGACY_LINK_ENABLED is true',
                });
            }
            if (!data.REMNAWAVE_API_TOKEN) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'REMNAWAVE_API_TOKEN is required when MARZBAN_LEGACY_LINK_ENABLED is true',
                });
            }
        }
    });

export type ConfigSchema = z.infer<typeof configSchema>;
export class Env extends createZodDto(configSchema) {}
