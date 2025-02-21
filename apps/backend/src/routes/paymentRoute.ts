import Razorpay from "razorpay";
import { Router } from "express";
import { UserRequest, verifySession } from "../middlewares/user/verifySession";
import { prisma } from "../db/client";
import { createPaymentSchema } from "../zod/paymentSchema";
import crypto from 'crypto';


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? "key",
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? "secret"
});

const router = Router();


router.post('/createRazrPayment', verifySession, async(req: UserRequest, res) => {
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

        const options = {
            amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
            currency: 'INR',
            receipt: `receipt_order_${new Date().getTime()}`, // Dynamic receipt
            payment_capture: 1, // Auto-capture
        };

        const order = await razorpay.orders.create(options);

        await prisma.payment.create({
            data: {
                purchaseId,
                userId,
                orderId: order.id,
                amount,
                paymentType: "Razorpay"
            }
        })

        return res.json({success: true, orderId: order.id, amount: order.amount})
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }
});


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


export default router





