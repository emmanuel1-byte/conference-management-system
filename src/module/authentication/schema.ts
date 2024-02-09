import { z } from 'zod'

export const SignUpSchema = z.object({
    fullname: z.string().min(5),
    email: z.string().email(),
    role: z.enum(['Partcipant','Speaker', 'Organizer']),  
    password: z.string()
})
.required()

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})
.required()