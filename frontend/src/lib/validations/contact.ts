import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message should be at least 10 characters').max(5000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
