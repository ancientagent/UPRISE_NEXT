import { z } from 'zod';

export const RegisterFromInviteSchema = z.object({
  inviteToken: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(100),
  password: z.string().min(8),
});

export type RegisterFromInviteDto = z.infer<typeof RegisterFromInviteSchema>;
