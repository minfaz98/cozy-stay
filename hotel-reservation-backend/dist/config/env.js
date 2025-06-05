import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10),
    PORT: z.string().optional().transform(v => v ? parseInt(v, 10) : 4000)
});
export const env = envSchema.parse(process.env);
