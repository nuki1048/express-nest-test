import { z } from 'zod'

export const ContactSchema = z.object({
  firstName: z.string().min(2, 'firstName').optional().or(z.literal('')),
  lastName: z.string().min(2, 'lastName').optional().or(z.literal('')),
  email: z
    .string()
    .min(1, { message: 'emailRequired' })
    .pipe(
      z.email({ message: 'emailInvalid' })
    ),
  phone: z.string().min(8, 'phone').optional().or(z.literal('')),
  message: z.string().min(1, 'messageRequired').min(10, 'messageTooShort'),
})

export type TypeContactFormState = z.infer<typeof ContactSchema>