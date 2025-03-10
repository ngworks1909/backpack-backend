import z from 'zod'

export const createCardSchema = z.object({
    cardName: z.string().min(4),
    
})