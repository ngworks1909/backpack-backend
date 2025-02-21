import z from 'zod'

export const createPaymentSchema = z.object({
    purchaseId: z.string(),
    amount: z.number().positive(),
})