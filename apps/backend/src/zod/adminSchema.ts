import {z} from 'zod'

export const validateCreateAdmin = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
    role: z.enum(["admin", "superadmin"]).optional()
})

export const validateAdminLogin = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})