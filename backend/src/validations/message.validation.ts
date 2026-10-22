import { z } from 'zod';

export const createMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Message cannot be empty').max(5000),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
