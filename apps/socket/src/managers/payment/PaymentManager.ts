import { Router } from "express";
import { UserRequest, verifySession } from "../../middlewares/auth/verifySession";
import { prisma } from "../../db/client";
import z from 'zod'

const router = Router();


router.put('/update', verifySession, async(req: UserRequest, res) => {
    try {
        //verify the payment
        //find purchase id through orderId
        //if success then SlotManager.approveSlot(purchaseId)
        //else call SlotManager.releaseSlot(purchaseId)
    } catch (error) {
        
    }
})

const createPaymentSchema = z.object({
    purchaseId: z.string(),
    amount: z.number().positive(),
})

router.post('/createWalletPay', verifySession, async(req: UserRequest, res) => {
    try {
        const userId = req.userId!
        const user = await prisma.user.findUnique({
            where: {
                userId
            }
        });

        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        };

        const isValidCreation = createPaymentSchema.safeParse(req.body);
        if(!isValidCreation.success){
            return res.status(400).json({success: false, message: "Invalid request"})    
        }    

        const { purchaseId, amount } = isValidCreation.data;
        
        const wallet = await prisma.wallet.findUnique({
            where: {
                userId
            },
            select: {
                walletId: true,
                amount: true
            }
        });

        if(!wallet){
            return res.status(400).json({success: false, message: "Wallet not found"})
        }

        if(wallet.amount < amount){
            return res.status(400).json({success: false, message: "Insufficient balance"})
        }

        try {
            await prisma.$transaction(async (tx) => {
                await tx.wallet.update({
                    where: {
                        walletId: wallet.walletId
                    },
                    data: {
                        amount: {
                            decrement: amount
                        }
                    }
                })
                await tx.payment.create({
                    data: {
                        purchaseId,
                        userId,
                        amount,
                        paymentType: "Wallet",
                        status: "Success"
                    }
                })
            })
            return res.status(200).json({success: true, message: "Payment successful"})
        } catch (error) {
            await prisma.purchase.delete({
                where: {
                    purchaseId
                }
            });
            return res.status(400).json({success: false, message: "Payment failed"})
        }  
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})