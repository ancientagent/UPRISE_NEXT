
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type Login = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(100),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type Register = z.infer<typeof RegisterSchema>;

export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(), // user id
  email: z.string().email(),
  username: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export type AuthTokens = z.infer<typeof AuthTokensSchema>;
